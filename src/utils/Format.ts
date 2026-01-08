class Format {
  public static price(price: number | bigint): string {
    const formatter = new globalThis.Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });

    return formatter.format(price);
  }

  public static date(dateString: Date) {
    const dateTimeOptions: globalThis.Intl.DateTimeFormatOptions = {
      weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
      month: 'short', // abbreviated month name (e.g., 'Oct')
      day: 'numeric', // numeric day of the month (e.g., '25')
      hour: 'numeric', // numeric hour (e.g., '8')
      minute: 'numeric', // numeric minute (e.g., '30')
      hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    };

    const dateDayOptions: globalThis.Intl.DateTimeFormatOptions = {
      weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
      year: 'numeric', // numeric year (e.g., '2023')
      month: '2-digit', // abbreviated month name (e.g., 'Oct')
      day: '2-digit', // numeric day of the month (e.g., '25')
    };

    const dateMonthOptions: globalThis.Intl.DateTimeFormatOptions = {
      month: 'long',
      year: 'numeric',
    };

    const dateOptions: globalThis.Intl.DateTimeFormatOptions = {
      month: 'short', // abbreviated month name (e.g., 'Oct')
      year: 'numeric', // numeric year (e.g., '2023')
      day: 'numeric', // numeric day of the month (e.g., '25')
    };

    const timeOptions: globalThis.Intl.DateTimeFormatOptions = {
      hour: 'numeric', // numeric hour (e.g., '8')
      minute: 'numeric', // numeric minute (e.g., '30')
      hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    };

    const formattedDateTime: string = new Date(dateString).toLocaleString(
      'en-US',
      dateTimeOptions
    );

    const formattedDateDay: string = new Date(dateString).toLocaleString(
      'en-US',
      dateDayOptions
    );

    const formattedDateMonth: string = new Date(dateString).toLocaleString(
      'en-US',
      dateMonthOptions
    );

    const formattedDate: string = new Date(dateString).toLocaleString(
      'en-US',
      dateOptions
    );

    const formattedTime: string = new Date(dateString).toLocaleString(
      'en-US',
      timeOptions
    );

    return {
      /** ddd, mmm dd, hh:mm tt */
      dateTime: formattedDateTime,
      /** ddd, mm/dd/yyyy */
      dateDay: formattedDateDay,
      /** mmm yyyy */
      dateMonth: formattedDateMonth,
      /** mmm dd, yyyy */
      dateOnly: formattedDate,
      /** hh:mm tt */
      timeOnly: formattedTime,
    };
  }
}

export default Format;
