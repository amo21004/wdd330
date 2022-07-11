import { qs, ael, aela } from "./utilities.js";

import { CMC } from "./cmc.js";

import { Holdings } from "./holdings.js";

const cmc = new CMC();

// Send a reference to the CMC object to the Holdings constructor so that this object can be accessed within it
const holdings = new Holdings(cmc);

const app = qs('#app');

// The initial HTML used by the app upon load
app.innerHTML = `
    <form id="add-currency">
        <input list="currencies" name="currency" id="currency" placeholder="Select Currency" required disabled>
        <datalist id="currencies"></datalist>

        <input list="exchanges" name="exchange" id="exchange" placeholder="Select Exchange" required disabled>
        <datalist id="exchanges"></datalist>

        <input type="number" name="amount" placeholder="Enter Amount" step="any" required>

        <button>
            <svg width="180px" height="30px" viewBox="0 0 180 30">
                <polyline points="179,1 179,29 1,29 1,1 179,1">
                <polyline points="179,1 179,29 1,29 1,1 179,1">
            </svg>

            <span>Add Currency</span>
        </button>
    </form>

    <h2>Holdings</h2>

    <div class="holdings-table"><table id="holdings">
        <thead>
            <tr>
                <th>Currency</th>
                <th>Amount</th>
                <th>Current Value</th>
                <th>Actions</th>
            </tr>
        </thead>

        <tbody>

        </tbody>

        <tfoot>
            <th colspan="3">Total</th>
            <th>0</th>
        </tfoot>
    </table></div>
`;

// A custom event
ael(document, 'currencies_loaded', function () {
    const currencies = qs('#currencies');

    cmc.listings.data.forEach(function (currency) {
        const option_element = document.createElement("option");

        option_element.value = currency.slug;

        option_element.text = currency.name;

        currencies.appendChild(option_element);
    });

    qs('#currency').disabled = false;

    holdings.display();
});

// A custom event
ael(document, 'exchanges_loaded', function () {
    const exchanges = qs('#exchanges');

    cmc.exchanges.data.forEach(function (exchange) {
        const option_element = document.createElement("option");

        option_element.value = exchange.name;

        exchanges.appendChild(option_element);
    });

    qs('#exchange').disabled = false;
});

ael('#add-currency', 'submit', function (event) {
    // Prevent form from submitting
    event.preventDefault();

    const form_data = new FormData(this);

    const currency = form_data.get('currency');

    const exchange = form_data.get('exchange');

    const amount = form_data.get('amount');

    // Make sure all values exist
    if (currency && exchange && amount) {
        holdings.add(currency, exchange, amount);

        // Reset the form fields once the holding is added
        this.reset();

        holdings.update();
    }
});

// A custom event
ael(document, 'displayed', function () {
    toggle_listener();

    holdings_delete_listener();

    holdings_refresh_listener();
});

// Listener for the delete icon
function holdings_delete_listener() {
    aela('main table .delete', 'click', function (event) {
        const id = event.target.parentElement.parentElement.dataset.holdingId;

        holdings.delete(id);
    });
};

// Listener for the refresh icon
function holdings_refresh_listener() {
    aela('main table .refresh', 'click', function (event) {
        holdings.update_individual(event.target.parentElement.parentElement.dataset.holdingSlug, true);
    });
};

// Listener for the details icon (+/-)
function toggle_listener() {
    aela('main table .open', 'click', function (event) {
        event.target.parentElement.nextElementSibling.style.display = 'table';

        event.target.nextElementSibling.style.display = 'inline-block';

        event.target.style.display = 'none';
    });

    aela('main table .close', 'click', function (event) {
        event.target.parentElement.nextElementSibling.style.display = 'none';

        event.target.previousElementSibling.style.display = 'inline-block';

        event.target.style.display = 'none';
    });
}

holdings.update();