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



const activity =
    document.getElementById("activity");

const income =
    document.getElementById("income");

const expenses =
    document.getElementById("expenses");

const previousExpenses =
    document.getElementById("previousExpenses");

const calculateBtn =
    document.getElementById("calculateBtn");

const resultCard =
    document.getElementById("resultCard");



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

    const value =
        Number(element.value);

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


    const expenseFields =
        document.querySelectorAll(
            ".expense-field"
        );

    const expenseResults =
        document.querySelectorAll(
            ".expense-result"
        );


    if (
        hasExpenseDeduction(rule)
    ) {

        expenseFields.forEach(
            element => {

                element
                    .classList
                    .remove("hidden");

            }
        );


        expenseResults.forEach(
            element => {

                element
                    .classList
                    .remove("hidden");

            }
        );


        activityInfo.innerHTML = `

            Հիմնական դրույքաչափ՝
            <strong>
                ${rule.rate}%
            </strong>։

            Ծախսերի նվազեցման դրույքաչափ՝
            <strong>
                ${rule.expenseRate}%
            </strong>։

            Վերջնական հարկը չի կարող լինել
            շրջանառության
            <strong>
                ${rule.minimumRate}%
            </strong>-ից պակաս։

        `;

    } else {

        expenseFields.forEach(
            element => {

                element
                    .classList
                    .add("hidden");

            }
        );


        expenseResults.forEach(
            element => {

                element
                    .classList
                    .add("hidden");

            }
        );


        activityInfo.innerHTML = `

            Այս գործունեության համար
            կիրառվում է

            <strong>
                ${rule.rate}%
            </strong>

            շրջանառության հարկի դրույքաչափ։

            Ծախսերի գծով նվազեցման
            մեխանիզմ այս հաշվարկում
            չի կիրառվում։

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

    const previousDeduction =
        getNumber(previousExpenses);


    if (
        revenue <= 0
    ) {

        return false;

    }


    /*
        1. ՀԻՄՆԱԿԱՆ ՀԱՐԿ
    */

    const taxBeforeDeduction =
        revenue *
        rule.rate /
        100;


    /*
        ԱՌԱՆՑ ԾԱԽՍԵՐԻ ՆՎԱԶԵՑՄԱՆ
    */

    if (
        !hasExpenseDeduction(rule)
    ) {

        finalTax.textContent =
            formatMoney(
                taxBeforeDeduction
            );


        baseRate.textContent =
            rule.rate + "%";


        initialTax.textContent =
            formatMoney(
                taxBeforeDeduction
            ) +
            " ֏";


        formulaText.innerHTML = `

            <strong>
                Հաշվարկ
            </strong>

            <br><br>

            ${formatMoney(revenue)} ֏
            ×
            ${rule.rate}%

            =

            <strong>
                ${formatMoney(taxBeforeDeduction)} ֏
            </strong>

        `;


        return true;

    }



    /*
        2. ՆՎԱԶԱԳՈՒՅՆ ՀԱՐԿ
    */

    const minimumTaxAmount =
        revenue *
        rule.minimumRate /
        100;



    /*
        3. ԸՆԹԱՑԻԿ ԺԱՄԱՆԱԿԱՇՐՋԱՆԻ
           ԾԱԽՍԵՐԻ ՀՆԱՐԱՎՈՐ ՆՎԱԶԵՑՈՒՄ
    */

    const currentPossibleDeduction =
        currentExpenses *
        rule.expenseRate /
        100;



    /*
        4. ԸՆԹԱՑԻԿ ԾԱԽՍԵՐՈՎ
           ԱՌԱՎԵԼԱԳՈՒՅՆ ԹՈՒՅԼԱՏՐԵԼԻ ՆՎԱԶԵՑՈՒՄ
    */

    const maximumCurrentDeduction =
        Math.max(
            0,
            taxBeforeDeduction -
            minimumTaxAmount
        );



    /*
        5. ԸՆԹԱՑԻԿ ԾԱԽՍԵՐԻ
           ԻՐԱԿԱՆ ՆՎԱԶԵՑՈՒՄ
    */

    const currentActualDeduction =
        Math.min(
            currentPossibleDeduction,
            maximumCurrentDeduction
        );



    /*
        6. ԸՆԹԱՑԻԿ ԾԱԽՍԵՐԻՑ ՀԵՏՈ
           ԱՌԱՋԱՑԱԾ ՀԱՐԿ
    */

    const taxAfterCurrentExpenses =
        Math.max(
            minimumTaxAmount,
            taxBeforeDeduction -
            currentActualDeduction
        );



    /*
        7. ՆԱԽՈՐԴ ԺԱՄԱՆԱԿԱՇՐՋԱՆԻՑ
           ՓՈԽԱՆՑՎԱԾ ՉՆՎԱԶԵՑՎԱԾ ԳՈՒՄԱՐ
    */

    const maximumPreviousDeduction =
        Math.max(
            0,
            taxAfterCurrentExpenses -
            minimumTaxAmount
        );



    /*
        Նախորդ ժամանակաշրջանի գումարի վրա
        expenseRate այլևս ՉԻ կիրառվում։

        Այն ուղղակի հաշվանցվում է
        ստացված հարկի հետ։
    */

    const previousActualDeduction =
        Math.min(
            previousDeduction,
            maximumPreviousDeduction
        );



    /*
        8. ՎԵՐՋՆԱԿԱՆ ՀԱՐԿ
    */

    const taxAfterDeduction =
        Math.max(
            minimumTaxAmount,
            taxAfterCurrentExpenses -
            previousActualDeduction
        );



    /*
        9. ԸՆԹԱՑԻԿ ԾԱԽՍԵՐԻՑ
           ԻՐԱԿԱՆ ՕԳՏԱԳՈՐԾՎԱԾ ԳՈՒՄԱՐ
    */

    let currentExpensesUsed = 0;


    if (
        rule.expenseRate > 0
    ) {

        currentExpensesUsed =
            currentActualDeduction /
            (
                rule.expenseRate /
                100
            );

    }


    currentExpensesUsed =
        Math.min(
            currentExpenses,
            currentExpensesUsed
        );



    /*
        10. ԸՆԹԱՑԻԿ ԺԱՄԱՆԱԿԱՇՐՋԱՆԻ
            ՉՕԳՏԱԳՈՐԾՎԱԾ ԾԱԽՍ
    */

    const remainingCurrentExpenses =
        Math.max(
            0,
            currentExpenses -
            currentExpensesUsed
        );



    /*
        11. ՆԱԽՈՐԴ ԺԱՄԱՆԱԿԱՇՐՋԱՆԻՑ
            ՉՕԳՏԱԳՈՐԾՎԱԾ ՄՆԱՑՈՐԴ
    */

    const remainingPreviousDeduction =
        Math.max(
            0,
            previousDeduction -
            previousActualDeduction
        );



    /*
        OUTPUT
    */

    baseRate.textContent =
        rule.rate + "%";


    initialTax.textContent =
        formatMoney(
            taxBeforeDeduction
        ) +
        " ֏";


    totalExpenses.textContent =
        formatMoney(
            currentExpenses
        ) +
        " ֏";


    expenseDeduction.textContent =
        "- " +
        formatMoney(
            currentActualDeduction
        ) +
        " ֏";


    minimumTax.textContent =
        formatMoney(
            minimumTaxAmount
        ) +
        " ֏";


    usedExpenses.textContent =
        formatMoney(
            currentExpensesUsed
        ) +
        " ֏";


    carryForward.textContent =
        formatMoney(
            remainingPreviousDeduction
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

        <strong>
            1․ Հիմնական հարկ
        </strong>

        <br>

        ${formatMoney(revenue)} ֏
        ×
        ${rule.rate}%

        =

        ${formatMoney(taxBeforeDeduction)} ֏


        <br><br>


        <strong>
            2․ Ընթացիկ ժամանակաշրջանի ծախսերի նվազեցում
        </strong>

        <br>

        ${formatMoney(currentExpenses)} ֏
        ×
        ${rule.expenseRate}%

        =

        ${formatMoney(currentPossibleDeduction)} ֏


        <br><br>


        <strong>
            3․ Ընթացիկ ծախսերից կիրառված նվազեցում
        </strong>

        <br>

        ${formatMoney(currentActualDeduction)} ֏


        <br><br>


        <strong>
            4․ Ընթացիկ ծախսերից հետո հարկ
        </strong>

        <br>

        ${formatMoney(taxBeforeDeduction)} ֏
        −
        ${formatMoney(currentActualDeduction)} ֏

        =

        <strong>
            ${formatMoney(taxAfterCurrentExpenses)} ֏
        </strong>


        <br><br>


        <strong>
            5․ Նախորդ ժամանակաշրջանից փոխանցված գումարի հաշվանցում
        </strong>

        <br>

        ${formatMoney(taxAfterCurrentExpenses)} ֏
        −
        ${formatMoney(previousActualDeduction)} ֏

        =

        <strong>
            ${formatMoney(taxAfterDeduction)} ֏
        </strong>


        <br><br>


        <strong>
            Նվազագույն հարկ
        </strong>

        <br>

        ${formatMoney(revenue)} ֏
        ×
        ${rule.minimumRate}%

        =

        ${formatMoney(minimumTaxAmount)} ֏

    `;



    if (
        remainingCurrentExpenses > 0
    ) {

        explanation += `

            <br><br>

            Ընթացիկ ժամանակաշրջանից
            չօգտագործված ծախս՝

            <strong>
                ${formatMoney(remainingCurrentExpenses)} ֏
            </strong>։

        `;

    }



    if (
        remainingPreviousDeduction > 0
    ) {

        explanation += `

            <br><br>

            Նախորդ ժամանակաշրջանից
            չօգտագործված և հետագա շրջան
            փոխանցվող գումար՝

            <strong>
                ${formatMoney(remainingPreviousDeduction)} ֏
            </strong>։

        `;

    }


    formulaText.innerHTML =
        explanation;


    return true;

}



/*
    ACTIVITY CHANGE
*/

activity.addEventListener(
    "change",
    () => {

        updateActivityInfo();


        resultCard
            .classList
            .add(
                "result-hidden"
            );

    }
);



/*
    INPUT ՓՈՓՈԽԵԼԻՍ
    ԱՐԴՅՈՒՆՔԸ ԹԱՔՑՆՈՒՄ ԵՆՔ
*/

[
    income,
    expenses,
    previousExpenses

].forEach(
    input => {

        input.addEventListener(
            "input",
            () => {

                resultCard
                    .classList
                    .add(
                        "result-hidden"
                    );

            }
        );

    }
);



/*
    CALCULATE BUTTON
*/

calculateBtn.addEventListener(
    "click",
    () => {

        const revenue =
            getNumber(
                income
            );


        if (
            revenue <= 0
        ) {

            alert(
                "Խնդրում ենք մուտքագրել շրջանառության գումարը։"
            );

            income.focus();

            return;

        }


        const calculated =
            calculateTax();


        if (
            !calculated
        ) {

            return;

        }



        /*
            ՑՈՒՅՑ ՏԱԼ ԱՐԴՅՈՒՆՔԸ
        */

        resultCard
            .classList
            .remove(
                "result-hidden"
            );


        resultCard
            .classList
            .remove(
                "result-visible"
            );



        /*
            ANIMATION RESTART
        */

        void resultCard.offsetWidth;


        resultCard
            .classList
            .add(
                "result-visible"
            );



        /*
            MOBILE + DESKTOP
            AUTO SCROLL
        */

        setTimeout(
            () => {

                resultCard
                    .scrollIntoView({

                        behavior: "smooth",
                        block: "start"

                    });

            },

            180

        );

    }
);



/*
    INITIAL STATE
*/

updateActivityInfo();