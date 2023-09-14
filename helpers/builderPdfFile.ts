import { axios, fs, load,  chalk as c} from "../libs";
import { pdfFile } from "./pdfFiles";

import getDate from '../utils/getDate'

const { log } = console

export default (urlLinkedin: string, headers: object) => {
  const { day, month, year, hours, minutes, seconds } = getDate()

  const path = `files/pdf/${day}-${month}-${year}`

  if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });

  axios
    .get(urlLinkedin, { headers })
    .then((response) => {
      const html = response.data;

      const $ = load(html);

      const cards = $('.job-search-card');

      const jobData: { title: string; link: string }[] = [];

      cards.each((index, card) => {
        const title = $(card).find('a').text().replaceAll(/\n/g, '').replaceAll(/\s{3,}/g, ' ');

        const link = $(card).find('a').attr('href');

        if (link) jobData.push({ title, link });
      });

      let lines = ''

      jobData.map(({ title, link }) => lines += `Vaga: ${title}\n\tLink de inscrição:\n\t\t${link}\n\n`)

      pdfFile.createPdf(`linkedin_jobs_${day}-${month}-${year}_${hours}h-${minutes}m-${seconds}s`, path, lines);

      log(c.green('PDF criado com sucesso!\nCaminho: ', process.cwd() + path));
    })
    .catch((error) => {
      console.error('Erro ao fazer a solicitação HTTP:', error);
    });

}