

export interface Beeper{
id:string,
name: string,
status: BeeperStatus,
created_at:Date,
detonated_at:Date|null,
latitude: number,
longitude:number,
}




export enum BeeperStatus{
   manufactured = "manufactured",
   assembled = "assembled",
   shipped = "shipped",
   deployed = "deployed",
   detonated = "detonated"
}


