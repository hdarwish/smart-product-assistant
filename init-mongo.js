db.getSiblingDB("admin").createUser({
    user: "storeAdmin",
    pwd: "storeAdmin2025",
    roles: [
        {
            role: "readWrite",
            db: "smart-product-assistant",
        },
    ],
});
