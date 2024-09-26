

export interface Beeper{
id:string,
name: string,
status: BeeperStatus,
created_at:Date,
detonated_at:Date|null,
latitude: Number,
longitude:Number,
}

export enum BeeperStatus{
   manufactured = "manufactured",
   assembled = "assembled",
   shipped = "shipped",
   deployed = "deployed",
   detonated = "detonated"
}


