const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Cast = require("../../util/cast");
const log = require("../../util/log");

class Scratch3NewBlocks {
    constructor(runtime) {
        this.runtime = runtime;
    }

    getInfo() {
        return {
            id: "newblocks",
            name: "New Blocks",
            blocks: [
                {
                    opcode: "writeLog",
                    blockType: BlockType.COMMAND,
                    text: "log POKEMON [TEXT]",
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 1,
                        },
                    },
                },
                {
                    opcode: "saveResult",
                    blockType: BlockType.COMMAND,
                    text: "save result [TEXT]",
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 1,
                        },
                    },
                },
                {
                    opcode: "getPokemon",
                    blockType: BlockType.REPORTER,
                    text: "POKEMON [TEXT]",
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 1,
                        },
                    },
                },
                {
                    opcode: "results",
                    blockType: BlockType.REPORTER,
                    text: "RESULTS [TEXT]",
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 1,
                        },
                    },
                },
            ],
            menus: {},
        };
    }

    results() {
        const result = [];
        return fetch("http://localhost:3000/result")
            .then((response) => response.json())
            .then((json) => json.forEach((json) => result.push(json)))
            .then((res) => {
                console.log(result);
                return result;
            });
    }

    saveResult(args) {
        const result = Cast.toString(args.TEXT);
        log.log(result);
        return fetch(`http://localhost:3000/result/test/${result}`, {
            method: "POST",
        });
        // .then((response) => response.json())
        // .then((json) => console.log(json));
    }
    // saveResult(args) {
    //     const text = Cast.toString(args.TEXT);
    //     // log.log(text);
    //     async function getPokemon() {
    //         const pokemon = await this.findNames(text);
    //         log.log(pokemon);
    //     }
    //     this.findNames(text).then((res) => {
    //         log.log(res);
    //     });

    //     // getPokemon();
    // }

    getPokemon(args) {
        const text = Cast.toString(args.TEXT);
        return fetch(
            `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=${args.TEXT}`
        )
            .then((response) => response.json())
            .then((json) => json.results.map((pokemon) => pokemon.name))
            .then((res) => `${res}`);

        // let pokemons = this.findNames(text).then((res) => {
        //     return res;
        // });
        // return `Argument TEXT is ${pokemons}`;

        // return `Argument TEXT is ${args.TEXT}`;
    }

    writeLog(args) {
        const text = Cast.toString(args.TEXT);
        // log.log(text);
        async function getPokemon() {
            const pokemon = await this.findNames(text);
            log.log(pokemon);
        }
        this.findNames(text).then((res) => {
            log.log(res);
        });

        // getPokemon();
    }

    findNames(n) {
        return fetch(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=${n}`)
            .then((response) => response.json())
            .then((json) => json.results.map((pokemon) => pokemon.name));
    }
}

module.exports = Scratch3NewBlocks;
