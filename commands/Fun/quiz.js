const ms = require('ms')

const numberToReaction = {
    "0":"1️⃣",
    "1":"2️⃣",
    "2":"3️⃣",
    "3":"4️⃣"
}

async function getGuildStatus(bot, guild) {
    const collection = bot.database.collection("servers");

    // create a filter for server id to find
    const filter = { "guildID": `${guild.id}` };
    
    const result = await collection.findOne(filter);
    if (!result){
        return null
    }else{
        return result
    }
}

async function getQuestions(bot){
    const collection = bot.database.collection("questions");
    const questions = await collection.find().toArray()
    return questions
}

async function getQuestionNumber(completeQuestions, questions){
    number = Math.floor(Math.random() * questions.length)
    while (completeQuestions.includes(number)){
        number = Math.floor(Math.random() * questions.length)
    }
    return number
}

const delay = ms => new Promise(res => setTimeout(res, ms));

module.exports.run = async (bot, message, args) => {
    let guild = message.channel.guild
    let guildStatus = await getGuildStatus(bot,guild)
    if (!guildStatus) return message.channel.createMessage("Sorry but this is a premium command.")
    let questionChannel = message.channel
    questions = await getQuestions(bot)
    questionMessage = await questionChannel.createMessage({embed:{
        title: "Among Us Bot Quiz",
        description: "You will have 30s to answer the question before the answer is shown.\nThe next question will be shown 10 seconds after that.\n**Good Luck!**",
    }})
    await delay(ms("20s"))
    completeQuestions = []
    for (let a = 0; a < 5; a++){
        questionNumber = await getQuestionNumber(completeQuestions, questions)
        completeQuestions.push(questionNumber)
        questionMessage.edit({content:'',embed:{
            title: `Question #${a+1}`,
            description: `${questions[questionNumber].question}`,
            fields:[
                {
                    name: "Answers",
                    value: questions[questionNumber].answers.join('\n')
                }
            ],
            footer: {
                text: `Submitted by ${questions[questionNumber].submitter}`
            }
        }})
        for (let n = 0; n < 4; n++){
            await questionMessage.addReaction(numberToReaction[n])
        }
        await delay(ms('30s'))
        let reactors = await questionMessage.getReaction(numberToReaction[questions[questionNumber].answers.indexOf(questions[questionNumber].correctAnswer)]   )
        let users = []
        reactors.forEach(user =>{
            users.push(`<@${user.id}>`)
        })
        users.pop(`<@$758833872107470888>`)
        let correct = (users.length > 0 ? users.join('\n') : "No One")
        questionMessage.edit({embed:{
            title: `Question #${a+1}`,
            description: `${questions[questionNumber].question}`,
            fields:[
                {
                    name: "Answers",
                    value: questions[questionNumber].answers.join('\n'),
                    inline: true
                },
                {
                    name: "Correct Answer",
                    value: questions[questionNumber].correctAnswer,
                    inline: true
                },
                {
                    name:"Correct People",
                    value: correct
                }
            ],
            footer: {
                text: `Submitted by ${questions[questionNumber].submitter}`
            }
        }})
        await delay(ms('5s'))
        questionMessage.removeReactions()
        await delay(ms('5s'))
    }
    questionMessage.edit({embed:{
        title: "Among Us Bot Quiz",
        description: "Quiz Ended\nWant to submit a question. You can do so in the [support server](https://aub.mysterybots.com/discord/).",
    }})
}

module.exports.info = {
    name: "quiz",
    description: "Starts an Among Us quiz in the Quiz channel (Premium)",
    category: "Fun",
    GuildOnly:true,
    cooldown: '4m'
}