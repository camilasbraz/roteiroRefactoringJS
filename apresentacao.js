var formatarMoeda = require("./util.js");

module.exports = function gerarFaturaStr(fatura, calc) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
        faturaStr += ` ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} \n`;
    return faturaStr;
}


// function gerarFaturaHTML(fatura, pecas) {
// /* <html>
// <p> Fatura UFMG </p>
// <ul>
// <li>  Hamlet: R$ 650,00 (55 assentos) </li>
// <li>  As You Like It: R$ 580,00 (35 assentos) </li>
// <li>  Othello: R$ 500,00 (40 assentos) </li>
// </ul>
// <p> Valor total: R$ 1.730,00 </p>
// <p> Créditos acumulados: 47 </p>
// </html> */
//   let faturaHtml = `
//     <html>
//       <p> Fatura ${fatura.cliente} </p>
//       <ul>
//   `;
//   for (let apre of fatura.apresentacoes) {
//     faturaHtml += `
//       <li> ${getPeca(pecas, apre).nome}:  ${formatarMoeda(calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos) </li>
//     `;
//   }
//   faturaHtml += `
//       </ul>
//       <p> Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes))} </p>
//       <p> Créditos acumulados: ${calcularTotalCreditos(pecas, fatura.apresentacoes)} </p>
//     </html>
//   `;
//   return faturaHtml;
// }

// const faturaHtml = gerarFaturaHTML(faturas, pecas);
// console.log(faturaHtml);