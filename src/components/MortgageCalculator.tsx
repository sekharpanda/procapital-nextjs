'use client'

import { useMemo, useState } from 'react'

function fmt(n: number) {
  return 'AED ' + Math.round(n).toLocaleString('en-US')
}

export function MortgageCalculator() {
  const [price, setPrice] = useState(1500000)
  const [down, setDown] = useState(20)
  const [rate, setRate] = useState(4.25)
  const [years, setYears] = useState(25)

  const { monthly, loan, downAmount } = useMemo(() => {
    const downAmount = (price * down) / 100
    const loan = price - downAmount
    const mr = rate / 100 / 12
    const n = years * 12
    const monthly =
      mr === 0 ? loan / n : (loan * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1)
    return { monthly, loan, downAmount }
  }, [price, down, rate, years])

  return (
    <div className="calc reveal in" id="calc">
      <h3>Mortgage calculator</h3>
      <p className="sub">Estimate your monthly repayment in seconds.</p>

      <div className="field">
        <label htmlFor="price">
          Property price <span id="priceVal">{fmt(price)}</span>
        </label>
        <input
          id="price"
          type="range"
          min={300000}
          max={10000000}
          step={50000}
          value={price}
          onChange={(e) => setPrice(+e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="down">
          Down payment <span id="downVal">{`${down}% · ${fmt(downAmount)}`}</span>
        </label>
        <input
          id="down"
          type="range"
          min={15}
          max={50}
          step={1}
          value={down}
          onChange={(e) => setDown(+e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="rate">
          Interest rate <span id="rateVal">{rate.toFixed(2)}%</span>
        </label>
        <input
          id="rate"
          type="range"
          min={2.5}
          max={8}
          step={0.05}
          value={rate}
          onChange={(e) => setRate(+e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="years">
          Term <span id="yearsVal">{years} years</span>
        </label>
        <input
          id="years"
          type="range"
          min={5}
          max={25}
          step={1}
          value={years}
          onChange={(e) => setYears(+e.target.value)}
        />
      </div>

      <div className="calc-result">
        <div className="label">Estimated monthly payment</div>
        <div className="amount" id="monthly">
          {fmt(monthly)}
        </div>
        <div className="note" id="loanNote">
          Loan amount {fmt(loan)} over {years} years
        </div>
      </div>
      <a href="#contact" className="btn btn-primary">
        Get this rate — free callback
      </a>
    </div>
  )
}
