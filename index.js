const { z } = require('zod');
const { promises: fs } = require('fs');
const readme = require('./readme.js');

const averageSchema = z.object({
  average: z.number().min(0).max(20),
});

const updateReadme = (average) => {
  const readmeContent = readme.replace(/{{average}}/g, average);

  fs.writeFile('README.md', readmeContent)
    .then(() => console.log('README.md updated'))
    .catch((err) => console.error(err));
}

const main = () => {
  fetch("https://epigrades.alexishenry.eu/api/average")
    .then(response => response.json())
    .then(data => {
      let isAverageValid = averageSchema.safeParse(data);

      if (isAverageValid.success) {
        updateReadme(isAverageValid.data.average);
      }
    });
}

main();
