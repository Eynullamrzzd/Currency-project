


    const apiUrl = "https://v6.exchangerate-api.com/v6/53976dffe728750b9dd8a22b/latest/";
    let exchangeRates;

    
    const fromCurrencySelect = document.querySelector("#from-currency");
    const toCurrencySelect = document.querySelector("#to-currency");
    const fromRateElement = document.querySelector("#from-rate");
    const toRateElement = document.querySelector("#to-rate");
    const fromTargetElement = document.querySelector("#from-target");
    const toTargetElement = document.querySelector("#to-target");
    const fromInputElement = document.querySelector("#from-input");
    const toInputElement = document.querySelector("#to-input");

    
    async function fetchExchangeRates(baseCurrency) {
        try {
            const response = await fetch(`${apiUrl}${baseCurrency}`);
            const data = await response.json();
            return data.conversion_rates;
        } catch (error) {
            console.error("Error fetching exchange rates:", error);
            throw error;
        }
    }

    async function updateInputValues(a,b) {
        document.querySelector("#from-currency").innerText = a;
        document.querySelector("#from-target").innerText = b;
        document.querySelector("#to-currency").innerText = b;
        document.querySelector("#to-target").innerText = a;

        let exchangeRates;
        await fetchExchangeRates(b).then(res => exchangeRates = res);
        console.log(a + "***");
        toRateElement.innerText = exchangeRates[a];
        console.log(exchangeRates);
    }

    
    async function updateConversionDetails() {
        try {
            const fromCurrency = fromCurrencySelect.innerText;
            const toCurrency = toCurrencySelect.innerText;

            exchangeRates = await fetchExchangeRates(fromCurrency);

            const exchangeRate = exchangeRates[toCurrency];
            const inverseExchangeRate = 1 / exchangeRate;

            fromRateElement.innerText = exchangeRate.toFixed(4);
            toRateElement.innerText = inverseExchangeRate.toFixed(4);

            fromTargetElement.innerText = toCurrency;
            toTargetElement.innerText = fromCurrency;

            
            document.getElementById('from-currency').innerText = fromCurrency;
            document.getElementById('to-currency').innerText = toCurrency;
            document.getElementById('from-rate').innerText = exchangeRate.toFixed(4);
            document.getElementById('to-rate').innerText = inverseExchangeRate.toFixed(4);
            document.getElementById('from-target').innerText = toCurrency;
            document.getElementById('to-target').innerText = fromCurrency;

            
            updateInputValues(fromCurrency,toCurrency);
        } catch (error) {
            console.error("Error updating conversion details:", error);
        }
    }

    const leftCurrencyChoices = document.querySelectorAll(".currency-choice");

    leftCurrencyChoices.forEach((currencyChoice) => {
        currencyChoice.addEventListener("click", function () {
            handleCurrencyClick(currencyChoice, leftCurrencyChoices);
            const toCurrency = toCurrencySelect.innerText;
            const fromCurrencyv= fromCurrencySelect.innerText;

            updateInputValues(toCurrency, currencyChoice.innerText)
        });
    });

    
    const rightCurrencyChoices = document.querySelectorAll(".currency-choice1");

    rightCurrencyChoices.forEach((currencyChoice) => {
        currencyChoice.addEventListener("click", function () {
            handleCurrencyClick(currencyChoice, rightCurrencyChoices);
            const fromCurrency = fromCurrencySelect.innerText;
            const toCurrency = toCurrencySelect.innerText;

            updateInputValues(fromCurrency, currencyChoice.innerText)
        });
    });

    
    async function handleCurrencyClick(currencyChoice, allChoices) {
       
        allChoices.forEach((choice) => {
            choice.classList.remove("active");
        });

       
        currencyChoice.classList.add("active"); 


        
    }
    
    
    fromInputElement.addEventListener("input", function () {
        
        fromInputElement.value = fromInputElement.value.replace(/[^0-9.]/g, "");

        const amount = parseFloat(fromInputElement.value) || 0;
        const toCurrency = toCurrencySelect.innerText;

        const exchangeRate = exchangeRates[toCurrency];

        const result = amount * exchangeRate;
        toInputElement.value = result.toFixed(4);
    });

    toInputElement.addEventListener("input", function () {
        
        toInputElement.value = toInputElement.value.replace(/[^0-9.]/g, "");

        const amount = parseFloat(toInputElement.value) || 0;
        const toCurrency = toCurrencySelect.innerText;

        const exchangeRate = exchangeRates[toCurrency];

        const result = amount / exchangeRate;
        fromInputElement.value = result.toFixed(4);
    });

    
    fromCurrencySelect.addEventListener("change", updateConversionDetails);

    
    toCurrencySelect.addEventListener("change", updateConversionDetails);

    
    updateConversionDetails();

