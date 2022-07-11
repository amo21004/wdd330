import { qs, lsr, lsw } from "./utilities.js";

class Holdings {
    constructor(cmc) {
        this.cmc = cmc;
    }

    add(currency, exchange, amount) {
        const holdings = this.get();

        holdings.push({
            id: uuidv4(),
            time: Date.now(),
            currency: currency,
            exchange: exchange,
            amount: parseFloat(amount)
        });

        this.save(holdings);

        this.display();
    }

    save(holdings) {
        lsw('holdings', holdings);
    }

    get() {
        const holdings = lsr('holdings');

        const parsed = JSON.parse(holdings);

        if (!parsed) {
            return [];
        }

        return parsed.sort((a, b) => a.currency - b.currency);
    }

    delete(id) {
        const holdings = this.get();

        this.save(holdings.filter(function (item) {
            return item.id != id
        }));

        this.display();
    }

    async update_individual(slug, force = false) {
        const self = this;

        await this.cmc.get_quotes(slug, force).then(function (items) {
            const key = Object.keys(items.data);

            self.cmc.quotes[items.data[key].slug] = items.data[key].quote.USD.price;

            self.display();
        });
    }

    update() {
        const self = this;

        const holdings = [];

        this.get().forEach(function (holding) {
            if (!holdings.includes(holding.currency)) {
                holdings.push(holding.currency);
            }
        });

        holdings.forEach(function (holding) {
            self.update_individual(holding);
        });
    }

    display() {
        const self = this;

        const holdings = {};

        const holdings_element_tbody = qs('#holdings tbody');

        const holdings_element_tfoot = qs('#holdings tfoot');

        this.get().forEach(function (holding) {
            if (!holdings[holding.currency]) {
                holdings[holding.currency] = [];
            }

            holdings[holding.currency].push(holding);
        });

        holdings_element_tbody.innerHTML = '';

        let total_value = 0;

        Object.entries(holdings).forEach(function (holding) {
            const tr_element = document.createElement("tr");

            const slug = holding[0];

            let name;

            self.cmc.listings.data.forEach(function (currency) {
                if (currency.slug == slug) {
                    name = currency.name;
                }
            });

            let total_amount = 0;

            let entries = '';

            holding[1].forEach(function (currency) {
                total_amount += currency.amount;

                entries += `
                    <tr data-holding-id=${currency.id}>
                    <td>${currency.exchange}</td>
                    <td>${currency.amount}</td>
                    <td class="actions"><span class="delete" title="Delete entry">🞨</span></td>
                    </tr>
                `;
            });

            tr_element.dataset.holdingSlug = slug;

            tr_element.innerHTML = `
                <td>${name} <span class="actions"><span class="open">➕</span> <span class="close">➖</span></span> <table><tbody>${entries}</tbody></table></td>
                <td>${total_amount}</td>
                <td>$${self.cmc.quotes[slug] * total_amount}</td>
                <td class="actions"><span class="refresh" title="Refresh price">⟳</span></td>
            `;

            holdings_element_tbody.appendChild(tr_element);

            total_value += self.cmc.quotes[slug] * total_amount;
        });

        holdings_element_tfoot.innerHTML = `
            <th colspan="3">Total</th>
            <th>${total_value}</th>
        `;

        document.dispatchEvent(new Event("displayed"));
    }
}

export { Holdings };