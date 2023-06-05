const { readFileSync } = require('fs');

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR",
    { style: "currency", currency: "BRL",
      minimumFractionDigits: 2 }).format(valor/100);
}

function getPeca(pecas, apre) {
  return pecas[apre.id];
}

function calcularCredito(pecas, apre) {
  let creditos = 0;
  creditos += Math.max(apre.audiencia - 30, 0);
  if (getPeca(pecas, apre).tipo === "comedia") 
      creditos += Math.floor(apre.audiencia / 5);
  return creditos;   
}

function calcularTotalCreditos(pecas, apresentacoes) {
  let total = 0;
  for (let apre of apresentacoes) {
    total += calcularCredito(pecas, apre);
  }
  return total;
}

function calcularTotalApresentacao(pecas, apre) {
  let total = 0;
  switch (getPeca(pecas, apre).tipo) {
  case "tragedia":
    total = 40000;
    if (apre.audiencia > 30) {
      total += 1000 * (apre.audiencia - 30);
    }
    break;
  case "comedia":
    total = 30000;
    if (apre.audiencia > 20) {
       total += 10000 + 500 * (apre.audiencia - 20);
    }
    total += 300 * apre.audiencia;
    break;
  default:
      throw new Error(`Peça desconhecia: ${getPeca(apre).tipo}`);
  }
  return total;
}

function calcularTotalFatura(pecas, apresentacoes) {
  let total = 0;
  for (let apre of apresentacoes) {
    total += calcularTotalApresentacao(pecas, apre);
  }
  return total;
}

function gerarFaturaStr (fatura, pecas) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
      faturaStr += `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
  return faturaStr;
}

function gerarFaturaHTML(fatura, pecas) {
/* <html>
<p> Fatura UFMG </p>
<ul>
<li>  Hamlet: R$ 650,00 (55 assentos) </li>
<li>  As You Like It: R$ 580,00 (35 assentos) </li>
<li>  Othello: R$ 500,00 (40 assentos) </li>
</ul>
<p> Valor total: R$ 1.730,00 </p>
<p> Créditos acumulados: 47 </p>
</html> */
  let faturaHtml = `
    <html>
      <p> Fatura ${fatura.cliente} </p>
      <ul>
  `;
  for (let apre of fatura.apresentacoes) {
    faturaHtml += `
      <li> ${getPeca(pecas, apre).nome}:  ${formatarMoeda(calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos) </li>
    `;
  }
  faturaHtml += `
      </ul>
      <p> Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes))} </p>
      <p> Créditos acumulados: ${calcularTotalCreditos(pecas, fatura.apresentacoes)} </p>
    </html>
  `;
  return faturaHtml;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
const faturaHtml = gerarFaturaHTML(faturas, pecas);
console.log(faturaStr);
console.log(faturaHtml);
