import builderCsvFile from "./helpers/builderCsvFile";
import builderPdfFile from "./helpers/builderPdfFile";

import { chalk as c, inquirer } from "./libs";

const { log } = console;

const urlLinkedin =
  'https://www.linkedin.com/jobs/search/?currentJobId=3718834058&f_AL=true&f_TPR=r86400&f_WT=2&geoId=106057199&keywords=front-end&location=Brasil&refresh=true&sortBy=R';

const headers = {
  'User-Agent':
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
};

log(
  c.green('Seja bem-vindo ao:'),
  c.blue('"Web scraping de Vagas de frontend"'),
  c.bgBlue(' — Linkedind — ') + '\n');

log(c.yellowBright(`
  Será gerado um arquivo contendo as vagas para desenvolvedores Font-end com os seguintes filtros:
    - termo: "front-end"
    - remoto
    - data do anúncio: últimas 24 horas
    - canditatura simplificada.\n`));

(() => {

  const options = [0, 1, 2];
  inquirer.prompt([

    {
      type: 'number',
      name: 'fileType',
      choices: [0, 1],
      message: 'Escolha o tipo de Aquivo ([0] - csv, [1] - pdf , [2] - sair):',
    }
  ]).then(answer => {
    const { fileType } = answer;

    if (!options.includes(fileType)) return log(c.red('valor inválido'));

    switch (fileType) {
      case 0: return builderCsvFile(urlLinkedin, headers);
      case 1: return builderPdfFile(urlLinkedin, headers);
      case 2: 
        log(c.blue('Volte Sempre!'));

        setTimeout(() => {
          process.exit();
        }, 500);
        break;   
      default: return;
    }
  })
})();




