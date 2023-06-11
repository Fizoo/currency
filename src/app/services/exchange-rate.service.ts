import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, interval, map, Observable, switchMap} from "rxjs";
import {ExchangeRate, IResponse} from "../models/currency";

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  private apiUrl = 'https://openexchangerates.org/api/latest.json'

  private apiKey = '5fe6f58a45554958a84e0b265373f480';

  private apiUrl2 = 'https://api.exchangerate-api.com/v4/latest/UAH';
  private apiUrl3 = 'https://v6.exchangerate-api.com/v6/97f4ec136a18202f85ec9d51/latest/UAH';

  private apiKey2 = '97f4ec136a18202f85ec9d51';

  eurValue$=new BehaviorSubject<number>(0)
  usdValue$=new BehaviorSubject<number>(0)

  constructor(private http:HttpClient) {
    interval(3600000) // Оновлюємо кожну годину
      .pipe(switchMap(() => this.getExchangeRates()))
      .subscribe();
  }

  getExchangeRates(): Observable<ExchangeRate[]> {
    return this.http.get<IResponse>(this.apiUrl3).pipe(
      map(response => response.conversion_rates),
      map((rates: { [key: string]: number })  => {
        const allowedCurrencies = ['USD', 'EUR', 'UAH'];
        const exchangeRates: ExchangeRate[] = [];

        for (const [currency, rate] of Object.entries(rates)) {
          if (allowedCurrencies.includes(currency)) {
            exchangeRates.push({ currency, rate } as ExchangeRate);
            this.updateExchangeRate(currency, rate);
          }
        }
        return exchangeRates;
      }),
      catchError(error => {
        console.error('Error retrieving exchange rates:', error);
        throw new Error('Failed to retrieve exchange rates. Please try again later.');
      })
    )
  }




  private updateExchangeRate(currency: string, rate: number) {
    if (currency === 'USD') {
      this.usdValue$.next(1 / rate);
    }
    if (currency === 'EUR') {
      this.eurValue$.next(1 / rate);
    }
  }

/*
  getExchangeRates2(): Observable<ExchangeRate[]> {
    return this.http.get<any>(this.apiUrl2).pipe(
      tap(el=>console.log(el)),
      map(response => response.rates),
      map((rates: { [key: string]: number })  => {
        const allowedCurrencies = ['USD', 'EUR', 'UAH'];
        const exchangeRates: ExchangeRate[] = [];

        for (const [currency, rate] of Object.entries(rates)) {
          if (allowedCurrencies.includes(currency)) {
            exchangeRates.push({ currency, rate } as ExchangeRate);

            this.updateExchangeRate(currency, rate);
          }
        }
        return exchangeRates;
      })
    )
  }*/

  /*getExchangeRates():Observable<any>{
    const url=`${this.apiUrl}?app_id=${this.apiKey}`
    return this.http.get<any>(url).pipe(
      map((response:any) => {
        const myRate = response.rates.UAH; // Отримати курс USD (відносно гривні)
        const baseRate = response.rates.USD; // Отримати курс USD (відносно гривні)
        const rates:any = {};

        for (const currency in response.rates) {
          if (currency === 'USD'|| currency==='EUR') {
            // Обчислити відносні курси валют відносно гривні
            rates[currency] = response.rates[currency]*myRate ;
          }
        }
        return rates;
      })
    )
  }*/
}
