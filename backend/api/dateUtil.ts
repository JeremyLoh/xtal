export default class DateUtil {
  public static getUnixTimestamp(date: Date): string {
    const milliseconds = date.getTime()
    const seconds = Math.floor(milliseconds / 1000)
    return seconds.toString()
  }
}
