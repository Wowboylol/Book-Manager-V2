export class Book
{
    public constructor(
        public id:number,
        public name:string,
        public description:string,
        public link:string,
        public imagePath:string,
        public rating:number,
        public dateCreated:Date,
        public dateUpdated:Date,
        public tags:string[],
        public collection:string
    ) {}
}