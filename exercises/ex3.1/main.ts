export {};

type AuthUser = {
    id: number, 
    name: string,
    surname: string
}

function sortUser(users: AuthUser[], sortBy: "id"|"name"|"surname"){
    switch(sortBy){
        case "id": {
            return users.sort(compareId);
        }
        case "name": {
            return users.sort(compareName)
        }
        case "surname": {
            return users.sort(compareSurname)
        }
        // no need for default because types ensure no other input
    }
}

function compareId(a: AuthUser, b: AuthUser){
    if(a.id < b.id){ 
        return - 1
    } 
    if (a.id > b.id){
        return +1
    } 
    return 0;
}

function compareName(a: AuthUser, b: AuthUser){
    if(a.name < b.name){ 
        return - 1
    } 
    if (a.name > b.name){
        return +1
    } 
    return 0;
}


function compareSurname(a: AuthUser, b: AuthUser){
    if(a.surname < b.surname){ 
        return - 1
    } 
    if (a.surname > b.surname){
        return +1
    } 
    return 0;
}

console.log(sortUser([{id: 3, name: "alice", surname: "smith"}, {id: 1, name: "colin", surname: "patel"}, {id: 2, name: "bob", surname: "li"}], "id")) // 1, 2, 3
console.log(sortUser([{id: 3, name: "alice", surname: "smith"}, {id: 1, name: "colin", surname: "patel"}, {id: 2, name: "bob", surname: "li"}], "name")) // alice, bob, colin
console.log(sortUser([{id: 3, name: "alice", surname: "smith"}, {id: 1, name: "colin", surname: "patel"}, {id: 2, name: "bob", surname: "li"}], "surname")) // li, patel, smith

