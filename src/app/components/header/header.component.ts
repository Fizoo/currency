import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ExchangeRateService} from "../../services/exchange-rate.service";
import {Observable} from "rxjs";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  usd: Observable<number>
  eur: Observable<number>

  constructor(private exchangeService: ExchangeRateService) {
  }

  ngOnInit(): void {
    this.usd = this.exchangeService.usdValue$
    this.eur = this.exchangeService.eurValue$
  }

}
