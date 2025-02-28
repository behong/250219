const axios = require('axios');
const cheerio = require('cheerio');
import { Cheerio } from 'cheerio';

const url = 'https://new.land.naver.com/complexes/112792?ms=37.345878,127.090312,17&a=APT:ABYG:JGC:PRE&e=RETAIL&ad=true&articleNo=2508979071&realtorId=coding9741';

async function fetchData() {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Select the items under list_panel and item_list item_list--article
        const items = $('.list_panel .item_list.item_list--article');

        items.each((_: number, element: Cheerio<Element>) => {
            const title = $(element).find('.title-selector').text().trim();
            const price = $(element).find('.price-selector').text().trim();
            const location = $(element).find('.location-selector').text().trim(); // Adjust the selector based on actual HTML structure

            console.log({
                title,
                price,
                location,
            });
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchData();