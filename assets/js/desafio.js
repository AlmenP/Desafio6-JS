const urlApi =`https://mindicador.cl/api/`;
const filterCurrencies = ['dolar', 'euro','uf'];
const selectCurrencies = document.querySelector('#currency');
const result = document.querySelector('#result');

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const total = (amount) =>
  `${(amount / selectCurrencies.value).toFixed(2)}`;

//obtener monedas de API
const getCurrencies = async () => {
    try {
        const reqCurrencies = await fetch(urlApi);
        const resData = await reqCurrencies.json();

//codigo de monedas
    const currencyList = filterCurrencies.map((currency) => {
        return {
            code: resData[currency].codigo,
            value: resData[currency].valor,
        };
    });

//mostrar monedas en el select
currencyList.forEach ((currency) => {
    const option = document.createElement('option');
    option.value = currency.value;
    option.textContent = `${currency.code}`;
    selectCurrencies.appendChild(option);
});
} catch (error) {
    alert('No se pueden mostrar las monedas')
}
};

//crear grafico
let chart; 
const createChart = async () => {
  try {
    const currency =
      selectCurrencies.options[
        selectCurrencies.selectedIndex
      ].text.toLowerCase();

    const reqChart = await fetch(`${urlApi}/${currency}`);
    const dataChart = await reqChart.json();

 
    const serieToChart = dataChart.serie.slice(0, 10).reverse();

    //grafico
    const data = {
      labels: serieToChart.map((item) => item.fecha.substring(0, 10)),
      datasets: [
        {
          label: currency,
          data: serieToChart.map((item) => item.valor),
          
          borderColor: "red",
          backgroundColor: "black",
        },
      ],
    };
    const config = {
        type: "line",
        data: data,
    };

    const chartDOM = document.querySelector('#chart');
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(chartDOM, config);
    chartDOM.classList.remove('d-none');
  } catch (error) {
    alert("Error al generar grafico");
  }
};

//fx al hacer click 
document.querySelector("#btn-convert").addEventListener("click", () => {
    const amountPesos = document.querySelector("#pesos").value;
   if (amountPesos === "") {
     alert("Ingrese la cantidad convertir");
    return;
    }
    result.innerHTML = total(amountPesos);
    createChart();
});

getCurrencies();