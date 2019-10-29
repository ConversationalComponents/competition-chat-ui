export default [
    {
        key: "id",
        types: ["string", "number"],
        required: true
    },
    {
        key: "user",
        types: ["boolean"],
        required: true
    },
    {
        key: "trigger",
        types: ["string", "number", "function"],
        required: false
    }
];
