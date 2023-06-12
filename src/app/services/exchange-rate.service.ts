import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, interval, map, Observable, switchMap} from "rxjs";
import {ExchangeRate, IResponse} from "../models/currency";

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  private apiUrl = 'https://v6.exchangerate-api.com/v6/97f4ec136a18202f85ec9d51/latest/UAH';
  private apiKey2 = '97f4ec136a18202f85ec9d51';

  eurValue$=new BehaviorSubject<number>(0)
  usdValue$=new BehaviorSubject<number>(0)

  constructor(private http:HttpClient) {
    interval(3600000) // Оновлюємо кожну годину
      .pipe(switchMap(() => this.getExchangeRates()))
      .subscribe();
  }

  getExchangeRates(): Observable<ExchangeRate[]> {
    return this.http.get<IResponse>(this.apiUrl).pipe(
      map(response => response.conversion_rates),
      map((rates: { [key: string]: number })  => {
        const allowedCurrencies = ['USD', 'EUR', 'UAH'];
        const exchangeRates: ExchangeRate[] = [];

        for (const [currency, rate] of Object.entries(rates)) {
          if (allowedCurrencies.includes(currency)) {
            exchangeRates.push({ currency, rate } as ExchangeRate);
            this.updateExchangeRateToUAH(currency, rate);
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

  private updateExchangeRateToUAH(currency: string, rate: number) {
    if (currency === 'USD') {
      this.usdValue$.next(1 / rate);
    }
    if (currency === 'EUR') {
      this.eurValue$.next(1 / rate);
    }
  }

}
