'use client'

import { useMemo, useState } from 'react'

function fmt(n: number) {
  return 'AED ' + Math.round(n).toLocaleString('en-US')
}

function fmtNum(n: number) {
  return Math.round(n).toLocaleString('en-US')
}

function parseNum(str: string) {
  const cleaned = String(str).replace(/[^\d.]/g, '')
  if (!cleaned) return NaN
  return parseFloat(cleaned)
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function MortgageCalculator() {
  const [price, setPrice] = useState(1500000)
  const [down, setDown] = useState(20)
  const [rate, setRate] = useState(4.25)
  const [years, setYears] = useState(25)
  const [priceText, setPriceText] = useState(fmtNum(1500000))
  const [downText, setDownText] = useState('20')
  const [rateText, setRateText] = useState('4.25')
  const [yearsText, setYearsText] = useState('25')

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
        <div className="field-top">
          <label htmlFor="priceInput">Property price</label>
          <div className="val-edit">
            <span className="val-affix">AED</span>
            <input
              id="priceInput"
              className="val-input val-input--price"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={priceText}
              aria-label="Property price in AED"
              onChange={(e) => {
                setPriceText(e.target.value)
                const n = parseNum(e.target.value)
                if (!isNaN(n) && n >= 1) setPrice(Math.round(n))
              }}
              onBlur={() => {
                const parsed = parseNum(priceText)
                const next = !isNaN(parsed) && parsed >= 1 ? Math.round(parsed) : price
                setPrice(next)
                setPriceText(fmtNum(next))
              }}
              onFocus={(e) => e.currentTarget.select()}
            />
          </div>
        </div>
        <input
          id="price"
          type="range"
          min={100000}
          max={50000000}
          step={10000}
          value={clamp(price, 100000, 50000000)}
          onChange={(e) => {
            const next = +e.target.value
            setPrice(next)
            setPriceText(fmtNum(next))
          }}
        />
      </div>
      <div className="field">
        <div className="field-top">
          <label htmlFor="down">Down payment</label>
          <div className="val-edit">
            <input
              id="downInput"
              className="val-input val-input--short"
              type="text"
              inputMode="decimal"
              value={downText}
              aria-label="Down payment percent"
              onChange={(e) => {
                setDownText(e.target.value)
                const n = parseNum(e.target.value)
                if (!isNaN(n) && n >= 15 && n <= 50) setDown(n)
              }}
              onBlur={() => {
                const next = clamp(parseNum(downText) || down, 15, 50)
                setDown(next)
                setDownText(String(next))
              }}
            />
            <span className="val-affix">%</span>
            <span className="val-sep">·</span>
            <span className="val-affix">{fmt(downAmount)}</span>
          </div>
        </div>
        <input
          id="down"
          type="range"
          min={15}
          max={50}
          step={1}
          value={down}
          onChange={(e) => {
            const next = +e.target.value
            setDown(next)
            setDownText(String(next))
          }}
        />
      </div>
      <div className="field">
        <div className="field-top">
          <label htmlFor="rate">Interest rate</label>
          <div className="val-edit">
            <input
              id="rateInput"
              className="val-input val-input--short"
              type="text"
              inputMode="decimal"
              value={rateText}
              aria-label="Interest rate percent"
              onChange={(e) => {
                setRateText(e.target.value)
                const n = parseNum(e.target.value)
                if (!isNaN(n) && n >= 2.5 && n <= 8) setRate(n)
              }}
              onBlur={() => {
                const next = clamp(parseNum(rateText) || rate, 2.5, 8)
                setRate(next)
                setRateText(next.toFixed(2))
              }}
            />
            <span className="val-affix">%</span>
          </div>
        </div>
        <input
          id="rate"
          type="range"
          min={2.5}
          max={8}
          step={0.05}
          value={rate}
          onChange={(e) => {
            const next = +e.target.value
            setRate(next)
            setRateText(next.toFixed(2))
          }}
        />
      </div>
      <div className="field">
        <div className="field-top">
          <label htmlFor="years">Term</label>
          <div className="val-edit">
            <input
              id="yearsInput"
              className="val-input val-input--short"
              type="text"
              inputMode="numeric"
              value={yearsText}
              aria-label="Loan term in years"
              onChange={(e) => {
                setYearsText(e.target.value)
                const n = parseNum(e.target.value)
                if (!isNaN(n) && n >= 5 && n <= 25) setYears(n)
              }}
              onBlur={() => {
                const next = clamp(parseNum(yearsText) || years, 5, 25)
                setYears(next)
                setYearsText(String(next))
              }}
            />
            <span className="val-affix">years</span>
          </div>
        </div>
        <input
          id="years"
          type="range"
          min={5}
          max={25}
          step={1}
          value={years}
          onChange={(e) => {
            const next = +e.target.value
            setYears(next)
            setYearsText(String(next))
          }}
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
