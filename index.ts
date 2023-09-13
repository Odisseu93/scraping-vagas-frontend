import axios from 'axios';
import { load } from 'cheerio';
import { createObjectCsvWriter } from 'csv-writer';

const urlLinkedin =
  'https://www.linkedin.com/jobs/search/?currentJobId=3718834058&f_AL=true&f_TPR=r86400&f_WT=2&geoId=106057199&keywords=front-end&location=Brasil&refresh=true&sortBy=R';

const headers = {
  'User-Agent':
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
};

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

      if(link) jobData.push({ title, link });
    });

    // Escreve os dados em um arquivo CSV
    const csvWriter = createObjectCsvWriter({
      path: `files/linkedin_jobs_${new Date().getTime()}.csv`,
      header: [
        { id: 'title', title: 'Title' },
        { id: 'link', title: 'Link' },
      ],
    });

    csvWriter.writeRecords(jobData).then(() => {
      console.log('Dados exportados para linkedin_jobs.csv');
    });
  })
  .catch((error) => {
    console.error('Erro ao fazer a solicitação HTTP:', error);
  });
