import { User } from "../types/User";

export class Trie {
    public root = new Node("\b");

    constructor(users?: User[])   {
        for(const user of users!)  {
            this.root.insert(user, user.name.toLowerCase().split(" ").join(""));
        }
    }

    filteredList(filterStr: string)  {
        return this.root.filteredDFS(filterStr.split(" ").join(""))
    }

}

class Node {
    value: any;
    children = new Array(27);
    isUser: boolean;
    constructor(val: any)    {
        this.children[26] = [];
        this.isUser = false;
        this.value = val;
    }

    insert(user: User, name: string)    {
        if(name.length === 0)   {
            this.isUser = true;
            this.children[26] = [...this.children[26], user];
        } else {
            let char = name.slice(0,1);
            let charAsIndx = char.charCodeAt(0) - 97
            let subStr = name.slice(1);
            if(this.children[charAsIndx] === undefined) {
                this.children[charAsIndx] = new Node(char);
            } 
            this.children[charAsIndx].insert(user, subStr)
        }
    }

    filteredDFS(filterStr: string): User[]  {
        if(filterStr.length === 0)  {
            return this.DFS();
        } else {
            let char = filterStr.slice(0,1).toLowerCase();
            let charAsIndx = char.charCodeAt(0) - 97;
            let subStr = filterStr.slice(1);
            if(this.children[charAsIndx] === undefined) return [];
            return this.children[charAsIndx].filteredDFS(subStr);
        }
    }

    DFS(): User[]   {
        let users: User[] = [];
        
        for(let indx = 0; indx < 26; indx++)    {
            if(this.children[indx]  !== undefined)  {
                users = [...users, ...this.children[indx].DFS()];
            }
        }

        if(this.isUser) {
            users = [...users, ...this.children[26]]
        }
        
        return users;
    }

}