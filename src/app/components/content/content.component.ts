import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {ExchangeRateService} from "../../services/exchange-rate.service";
import {ExchangeRate} from "../../models/currency";
import {debounceTime, Subject, takeUntil} from "rxjs";


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, OnDestroy {
  amountFrom = new FormControl()
  currencyFrom = new FormControl()
  amountTo = new FormControl()
  currencyTo = new FormControl()

  currencyList: ExchangeRate[] = []
  private unsubscribe$ = new Subject<void>();

  constructor(private exchangeService: ExchangeRateService) {
  }

  ngOnInit(): void {


    this.amountFrom.valueChanges.pipe(
      debounceTime(300),
      takeUntil(this.unsubscribe$))
      .subscribe(() => this.convertFrom())

    this.currencyFrom.valueChanges.pipe(
      debounceTime(300),
      takeUntil(this.unsubscribe$))
      .subscribe(() => this.convertFrom())

    this.amountTo.valueChanges.pipe(
      debounceTime(300),
      takeUntil(this.unsubscribe$))
      .subscribe(() => this.convertTo())

    this.currencyTo.valueChanges.pipe(
      debounceTime(300),
      takeUntil(this.unsubscribe$))
      .subscribe(() => this.convertFrom())

    this.exchangeService.getExchangeRates().pipe(
      takeUntil(this.unsubscribe$))
      .subscribe(rates => {
        this.currencyList = rates
        this.setInitialValues()
      })
  }

  setInitialValues(): void {
    const currencyFrom = this.currencyList.find(rate => rate.currency === 'USD');
    const currencyTo = this.currencyList.find(rate => rate.currency === 'UAH');

    if (currencyFrom) {
      this.currencyFrom.setValue(currencyFrom, {emitEvent: false});
    }
    if (currencyTo) {
      this.currencyTo.setValue(currencyTo, {emitEvent: false});
    }
  }

  convertFrom(): void {
    const amount = this.amountFrom.value;
    const currencyFrom = this.currencyFrom.value?.rate;
    const currencyTo = this.currencyTo.value?.rate;
    if (currencyFrom && currencyTo) {
      const convertedAmount = (currencyTo / currencyFrom) * amount;
      const formattedAmount = convertedAmount.toFixed(2);
      this.amountTo.setValue(formattedAmount, {emitEvent: false});
    }
  }

  convertTo(): void {
    const amount = this.amountTo.value;
    const currencyFrom = this.currencyFrom.value?.rate;
    const currencyTo = this.currencyTo.value?.rate;
    if (currencyFrom && currencyTo) {
      const convertedAmount = (currencyFrom / currencyTo) * amount;
      const formattedAmount = convertedAmount.toFixed(2);
      this.amountFrom.setValue(formattedAmount, {emitEvent: false});
    }
  }

  compare() {
    const currencyFrom = this.currencyFrom.value
    const currencyTo = this.currencyTo.value
    this.currencyFrom.setValue(currencyTo)
    this.currencyTo.setValue(currencyFrom)

  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
