export default [
    {
        key: "id",
        types: ["string", "number"],
        required: true
    },
    {
        key: "component",
        types: ["any"],
        required: true
    },

    {
        key: "waitAction",
        types: ["boolean"],
        required: false
    },
    {
        key: "asMessage",
        types: ["boolean"],
        required: false
    },
    {
        key: "trigger",
        types: ["string", "number", "function"],
        required: false
    },
    {
        key: "delay",
        types: ["number"],
        required: false
    }
];
