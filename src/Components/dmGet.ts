export function dmGet(unix_timestamp: number): string {
   let date = new Date(unix_timestamp * 1000);
  
   let month = ("0" + (date.getMonth() + 1)).slice(-2);
   let day = ("0" + date.getDate()).slice(-2);
   return day + "/" + month

}