const { getLeagueOverview } = require('./espnReader');

const test = async () => {
    const data = await getLeagueOverview('286565', 2018);
    console.log(data);
    return data;
}

test();

const result = [
    {
        id: 1,
        nickname: "",
        schedule: [
            {
                week: 1,
                roster: [
                    {
                        position: "QB",
                        name: "",
                        starter: true,
                        points: 12
                    },
                    {
                        position: "QB",
                        starter: true,
                        points: 12
                    }
                ]
            }
        ]
    }
]