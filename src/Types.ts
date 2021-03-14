export type user = {
    id:number
    went:number
    row:number
    bitcoin:number
    password?:string
    status?:'row'|'went'
}