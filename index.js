const { z } = require("zod");
const { promises: fs } = require("fs");
const readme = require("./readme.js");

const averageSchema = z.object({
    average: z.number().min(0).max(20),
});

const getCommit = (currentAverage, average) => {
    let type = currentAverage < average ? "increase" : "decrease";

    return `${
        type === "increase" ? "🚀" : "🔻"
    } Average has ${type}d to ${average}/20`;
};

const updateReadme = async (average) => {
    const currentReadme = await fs.readFile("README.md", "utf-8");
    const readmeContent = readme.replace(/{{average}}/g, average);

    fs.writeFile("README.md", readmeContent)
        .then(() => {
            const currentAverageSentence = currentReadme.match(
                /My current average at Epitech is \d{1,2}\.\d{2}\/20/
            )[0];

            const currentAverage =
                currentAverageSentence.match(/\d{1,2}\.\d{2}/)[0];

            if (currentAverage === average) return;

            let commit = getCommit(currentAverage, average);

            fs.writeFile("commit.txt", commit).then(() => {
                console.log(commit);
            });
        })
        .catch((err) => console.error(err));
};

const main = () => {
    fetch("https://epigrades.alexishenry.eu/api/average")
        .then((response) => response.json())
        .then(async (data) => {
            let isAverageValid = averageSchema.safeParse(data);

            if (isAverageValid.success) {
                await updateReadme(isAverageValid.data.average.toString());
            }
        });
};

main();
