document.addEventListener('DOMContentLoaded', function () {
    const apiKey = '628ef80f77a6859383faeb22b1187116';
    const apiUrl = `https://api.exchangerate.host/latest?apikey=${apiKey}`;
  
    async function getExchangeRate(baseCurrency, targetCurrency) {
      if (baseCurrency === targetCurrency) {
        return 1; 
      }
  
      const params = `&base=${baseCurrency}&symbols=${targetCurrency}`;
      const apiUrlWithParams = `${apiUrl}${params}`;
  
      try {
        const response = await fetch(apiUrlWithParams);
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
  
        const data = await response.json();
  
        if (!data.success) {
          throw new Error(`API error: ${data.error.info}`);
        }
  
        return data.rates[targetCurrency];
      } catch (error) {
        
        displayErrorMessage('Something went wrong. Please try again later.');
        return null;
      }
    }
  
    function updateConversionDetails(inputField) {
      const fromCurrency = document.getElementById('from-currency').textContent;
      const toCurrency = document.getElementById('to-currency').textContent;
  
      let inputValue = inputField.value.replace(/[^0-9.]/g, '');
      inputValue = parseFloat(inputValue) || 0;
  
      const exchangeRate = parseFloat(document.getElementById('from-rate').textContent) || 1;
  
      const convertedValue = (inputValue * exchangeRate).toFixed(2);
  
      const roundedValue = parseFloat(convertedValue).toFixed(4);
  
      inputField.value = roundedValue;
      document.getElementById('to-rate').textContent = exchangeRate.toFixed(4);
      document.getElementById('to-target').textContent = toCurrency;
    }
  
    async function handleCurrencySelection(event) {
      const selectedCurrency = event.target.textContent;
      const inputField = event.target.closest('.conversion-inputs').querySelector('input');
  
      const currencyOptions = event.target.closest('.currency-options').querySelectorAll('.currency-choice');
      currencyOptions.forEach(choice => {
        choice.style.backgroundColor = '';
        choice.style.color = '#c6c6c6';
      });
  
      event.target.style.backgroundColor = '#833AE0';
      event.target.style.color = 'white';
  
      
      inputField.placeholder = `${selectedCurrency}`;
  
      
      const fromCurrency = document.getElementById('from-currency').textContent;
      const toCurrency = document.getElementById('to-currency').textContent;
  
      const fromRate = await getExchangeRate(fromCurrency, toCurrency);
      const toRate = await getExchangeRate(toCurrency, fromCurrency);
  
      if (fromRate !== null && toRate !== null) {
        document.getElementById('from-rate').textContent = (1 / fromRate).toFixed(4);
        document.getElementById('to-rate').textContent = toRate.toFixed(4);
        document.getElementById('to-target').textContent = toCurrency;
  
        updateConversionDetails(inputField);
  
        localStorage.setItem('selectedCurrencies', JSON.stringify({
          fromCurrency: fromCurrency,
          toCurrency: toCurrency,
        }));
      } else {
        alert('Something went wrong. Please try again later.');
      }
    }
  
    async function initializeConverter() {
      
      document.getElementById('from-currency').textContent = 'RUB';
      document.getElementById('to-currency').textContent = 'USD';
  
      
  
      
      const rubChoice = document.querySelector('.currency-choice:contains("RUB")');
      const usdChoice = document.querySelector('.currency-choice:contains("USD")');
  
      if (rubChoice && usdChoice) {
        rubChoice.click();
        usdChoice.click();
      }
  
      const exchangeRateRubToUsd = await getExchangeRate('RUB', 'USD');
  
      if (exchangeRateRubToUsd !== null) {
        document.getElementById('from-rate').textContent = exchangeRateRubToUsd.toFixed(4);
        document.getElementById('to-rate').textContent = exchangeRateRubToUsd.toFixed(4);
        document.getElementById('to-target').textContent = 'USD';
  
        
        const convertedValueUsd = (100 * exchangeRateRubToUsd).toFixed(2);
        document.getElementById('to-input').value = parseFloat(convertedValueUsd).toFixed(4);
      } else {
        
        displayErrorMessage('Something went wrong. Please try again later.');
      }
    }
  
    
    document.getElementById('from-input').addEventListener('input', function () {
      updateConversionDetails(this);
    });
  
    document.getElementById('to-input').addEventListener('input', function () {
      updateConversionDetails(this);
    });
  
    const currencyOptionsContainers = document.querySelectorAll('.currency-options');
    currencyOptionsContainers.forEach(container => {
      const currencyChoices = container.querySelectorAll('.currency-choice');
      currencyChoices.forEach(choice => choice.addEventListener('click', handleCurrencySelection));
    });
  
    
    initializeConverter();
  
    function displayErrorMessage(message) {
      
    }
  });
  