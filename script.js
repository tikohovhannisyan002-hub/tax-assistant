const taxRules = {

    trade: {
        name: "Առևտրական գործունեություն",
        rate: 10,
        expenseRate: 9.5,
        minimumRate: 1
    },

    secondary: {
        name: "Երկրորդային հումքի առևտուր",
        rate: 5,
        expenseRate: null,
        minimumRate: null
    },

    newspaper: {
        name: "Թերթերի օտարում",
        rate: 1.5,
        expenseRate: null,
        minimumRate: null
    },

    production: {
        name: "Արտադրական գործունեություն",
        rate: 7,
        expenseRate: 5,
        minimumRate: 3
    },

    rent: {
        name: "Վարձակալական վճար, տոկոս, ռոյալթի",
        rate: 10,
        expenseRate: null,
        minimumRate: null
    },

    food: {
        name: "Հանրային սննդի ոլորտ",
        rate: 12,
        expenseRate: 9,
        minimumRate: 3.5
    },

    food_other: {
        name: "Հանրային սննդի հայտարարություն ներկայացրած անձի այլ գործունեություն",
        rate: 20,
        expenseRate: null,
        minimumRate: null
    },

    hightech: {
        name: "Բարձր տեխնոլոգիաների ոլորտ",
        rate: 1,
        expenseRate: null,
        minimumRate: null
    },

    assets: {
        name: "Այլ ակտիվների օտարում",
        rate: 10,
        expenseRate: null,
        minimumRate: null
    },

    other: {
        name: "Այլ գործունեություն",
        rate: 10,
        expenseRate: 6,
        minimumRate: 4.5
    }

};


const activity = document.getElementById("activity");

const income = document.getElementById("income");

const expenses = document.getElementById("expenses");

const previousExpenses =
    document.getElementById("previousExpenses");

const calculateBtn =
    document.getElementById("calculateBtn");


const finalTax =
    document.getElementById("finalTax");

const baseRate =
    document.getElementById("baseRate");

const initialTax =
    document.getElementById("initialTax");

const totalExpenses =
    document.getElementById("totalExpenses");

const expenseDeduction =
    document.getElementById("expenseDeduction");

const minimumTax =
    document.getElementById("minimumTax");

const usedExpenses =
    document.getElementById("usedExpenses");

const carryForward =
    document.getElementById("carryForward");

const formulaText =
    document.getElementById("formulaText");

const activityInfo =
    document.getElementById("activityInfo");


function formatMoney(value) {

    return Math.round(value)
        .toLocaleString("hy-AM");

}


function getNumber(element) {

    const value = Number(element.value);

    if (
        isNaN(value) ||
        value < 0
    ) {
        return 0;
    }

    return value;

}


function hasExpenseDeduction(rule) {

    return (
        rule.expenseRate !== null &&
        rule.minimumRate !== null
    );

}


function updateActivityInfo() {

    const rule =
        taxRules[activity.value];

    baseRate.textContent =
        rule.rate + "%";


    const expenseFields =
        document.querySelectorAll(
            ".expense-field"
        );

    const expenseResults =
        document.querySelectorAll(
            ".expense-result"
        );


    if (hasExpenseDeduction(rule)) {

        expenseFields.forEach(
            el => el.classList.remove("hidden")
        );

        expenseResults.forEach(
            el => el.classList.remove("hidden")
        );


        activityInfo.innerHTML = `
            Հիմնական դրույքաչափ՝
            <strong>${rule.rate}%</strong>։
            Ծախսերի նվազեցման դրույքաչափ՝
            <strong>${rule.expenseRate}%</strong>։
            Վերջնական հարկը չի կարող լինել
            շրջանառության
            <strong>${rule.minimumRate}%</strong>-ից պակաս։
        `;

    } else {

        expenseFields.forEach(
            el => el.classList.add("hidden")
        );

        expenseResults.forEach(
            el => el.classList.add("hidden")
        );


        activityInfo.innerHTML = `
            Այս գործունեության համար կիրառվում է
            <strong>${rule.rate}%</strong>
            շրջանառության հարկի դրույքաչափ։
            Ծախսերի գծով նվազեցման մեխանիզմ
            այս հաշվարկում չի կիրառվում։
        `;

    }

}


function calculateTax() {

    const rule =
        taxRules[activity.value];

    const revenue =
        getNumber(income);

    const currentExpenses =
        getNumber(expenses);

    const oldExpenses =
        getNumber(previousExpenses);


    if (revenue <= 0) {

        alert(
            "Խնդրում ենք մուտքագրել շրջանառության գումարը։"
        );

        return;

    }


    /*
        ՀԻՄՆԱԿԱՆ ՀԱՐԿ
    */

    const taxBeforeDeduction =
        revenue * rule.rate / 100;


    /*
        ԵԹԵ ՉԿԱ ԾԱԽՍԵՐԻ ՆՎԱԶԵՑՈՒՄ
    */

    if (!hasExpenseDeduction(rule)) {

        finalTax.textContent =
            formatMoney(taxBeforeDeduction);

        initialTax.textContent =
            formatMoney(taxBeforeDeduction) + " ֏";

        baseRate.textContent =
            rule.rate + "%";


        formulaText.innerHTML = `
            ${formatMoney(revenue)} ֏
            × ${rule.rate}%
            =
            <strong>
                ${formatMoney(taxBeforeDeduction)} ֏
            </strong>
        `;

        return;

    }


    /*
        ԸՆԴՀԱՆՈՒՐ ՆՎԱԶԵՑՎՈՂ ԾԱԽՍ
    */

    const availableExpenses =
        currentExpenses + oldExpenses;


    /*
        ԾԱԽՍԵՐԻ ՀԻՄՆԱԿԱՆ ՆՎԱԶԵՑՈՒՄ
    */

    const possibleDeduction =
        availableExpenses *
        rule.expenseRate /
        100;


    /*
        ՆՎԱԶԱԳՈՒՅՆ ՀԱՐԿ
    */

    const minimumTaxAmount =
        revenue *
        rule.minimumRate /
        100;


    /*
        ՈՐՔԱՆ ԿԱՐՈՂ ԵՆՔ ԱՌԱՎԵԼԱԳՈՒՅՆԸ ՆՎԱԶԵՑՆԵԼ

        Օրինակ՝

        հիմնական հարկ = 1,000,000
        նվազագույն հարկ = 100,000

        առավելագույն նվազեցում =
        900,000
    */

    const maximumAllowedDeduction =
        Math.max(
            0,
            taxBeforeDeduction -
            minimumTaxAmount
        );


    /*
        ԻՐԱԿԱՆ ՆՎԱԶԵՑՈՒՄ
    */

    const actualDeduction =
        Math.min(
            possibleDeduction,
            maximumAllowedDeduction
        );


    /*
        ՎԵՐՋՆԱԿԱՆ ՀԱՐԿ
    */

    const taxAfterDeduction =
        Math.max(
            minimumTaxAmount,
            taxBeforeDeduction -
            actualDeduction
        );


    /*
        ՈՐՔԱՆ ԾԱԽՍ Է ԻՐԱԿԱՆՈՒՄ ՕԳՏԱԳՈՐԾՎԵԼ

        Եթե նվազեցման դրույքաչափը 9.5% է,
        իսկ օգտագործված նվազեցումը 950,000,
        ապա օգտագործված ծախսը՝

        950000 / 0.095
    */

    let expensesActuallyUsed = 0;

    if (rule.expenseRate > 0) {

        expensesActuallyUsed =
            actualDeduction /
            (rule.expenseRate / 100);

    }


    expensesActuallyUsed =
        Math.min(
            availableExpenses,
            expensesActuallyUsed
        );


    /*
        ՀԱՋՈՐԴ ԺԱՄԱՆԱԿԱՇՐՋԱՆ
        ՓՈԽԱՆՑՎՈՂ ԾԱԽՍ
    */

    const remainingExpenses =
        Math.max(
            0,
            availableExpenses -
            expensesActuallyUsed
        );


    /*
        OUTPUT
    */

    baseRate.textContent =
        rule.rate + "%";

    initialTax.textContent =
        formatMoney(
            taxBeforeDeduction
        ) + " ֏";

    totalExpenses.textContent =
        formatMoney(
            availableExpenses
        ) + " ֏";

    expenseDeduction.textContent =
        "- " +
        formatMoney(
            actualDeduction
        ) +
        " ֏";

    minimumTax.textContent =
        formatMoney(
            minimumTaxAmount
        ) +
        " ֏";

    usedExpenses.textContent =
        formatMoney(
            expensesActuallyUsed
        ) +
        " ֏";

    carryForward.textContent =
        formatMoney(
            remainingExpenses
        ) +
        " ֏";

    finalTax.textContent =
        formatMoney(
            taxAfterDeduction
        );


    /*
        ԲԱՑԱՏՐՈՒԹՅՈՒՆ
    */

    let explanation = `

        <strong>1․ Հիմնական հարկ</strong><br>

        ${formatMoney(revenue)} ֏
        × ${rule.rate}%
        =
        ${formatMoney(taxBeforeDeduction)} ֏

        <br><br>


        <strong>2․ Ծախսերով հնարավոր նվազեցում</strong><br>

        ${formatMoney(availableExpenses)} ֏
        × ${rule.expenseRate}%
        =
        ${formatMoney(possibleDeduction)} ֏

        <br><br>


        <strong>3․ Նվազագույն հարկ</strong><br>

        ${formatMoney(revenue)} ֏
        × ${rule.minimumRate}%
        =
        ${formatMoney(minimumTaxAmount)} ֏

        <br><br>


        <strong>4․ Վերջնական հաշվարկ</strong><br>

        ${formatMoney(taxBeforeDeduction)} ֏
        −
        ${formatMoney(actualDeduction)} ֏
        =
        <strong>
            ${formatMoney(taxAfterDeduction)} ֏
        </strong>

    `;


    if (
        possibleDeduction >
        maximumAllowedDeduction
    ) {

        explanation += `

            <br><br>

            Ծախսերի ամբողջ նվազեցումը չի կիրառվել,
            քանի որ հարկը չի կարող լինել
            շրջանառության
            <strong>
                ${rule.minimumRate}%
            </strong>-ից պակաս։

            <br>

            Չօգտագործված ծախս՝
            <strong>
                ${formatMoney(remainingExpenses)} ֏
            </strong>։

        `;

    }


    formulaText.innerHTML =
        explanation;

}


activity.addEventListener(
    "change",
    () => {

        updateActivityInfo();

        calculateTaxIfPossible();

    }
);


calculateBtn.addEventListener(
    "click",
    calculateTax
);


/*
    ՑԱՆԿՈՒԹՅԱՆ ԴԵՊՔՈՒՄ
    ՀԱՇՎԱՐԿԸ ԱՆՄԻՋԱՊԵՍ ԹԱՐՄԱՑՆՈՒՄ ԵՆՔ
*/

[
    income,
    expenses,
    previousExpenses
].forEach(input => {

    input.addEventListener(
        "input",
        calculateTaxIfPossible
    );

});


function calculateTaxIfPossible() {

    if (getNumber(income) > 0) {
        calculateTax();
    }

}


/*
    INITIAL STATE
*/

updateActivityInfo();