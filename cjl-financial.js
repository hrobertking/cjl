(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define([ ], function() {
      return (root.Cathmhaol = factory(root));
    });
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Cathmhaol = factory(root);
  }
}(this, function(window) {
  'use strict';

  var Cathmhaol = window.Cathmhaol || {};

  /**
   * Financial calculators.
   *
   * @author    Robert King (hrobertking@cathmhaol.com)
   *
   * @version   2.0
   * @example   var oSchedule = Cathmhaol.Financial.amortize(100000.00, 6.5, 30, true);
   */
  Cathmhaol.Financial = {
    /**
     * Returns an multi-dimensional array containing an amortization schedule when given the principal, the apr, the number of years before the loan is due, and whether or not there is to be a balloon payment.
     *
     * @return   {object[]}
     * @param    {float} principal
     * @param    {float} apr
     * @param    {integer} years
     * @param    {boolean} balloon
     */
    amortize: function(principal, apr, years, balloon) {
      var aapr        // apr adjusted for periods less than 1 year
        , balance     // balance remaining
        , bln         // balloon payment flag
        , coll = [ ]  // data collection
        , debt        // principal portion of the payment
        , index       // loop index
        , interest    // interest portion of the payment
        , payment     // total payment amount
        , periods     // number of payment periods
      ;

      // while the balance is greater than zero and the balloon payment is not
      // set, calculate the payment against principal and the interest payment
      // for the period. Adjust the balance due and check to make sure we
      // haven't set the balloon flag on each iteration and add the data to
      // the array.

      apr = isNaN(apr) ? 0 : parseFloat(apr);
      principal = isNaN(principal) ? 0 : parseFloat(principal);
      years = isNaN(years) ? 0 : parseFloat(years);

      function sanitize(num) {
        return Math.abs(Math.round(num * 100)/100);
      }

      balance = principal;
      coll[0] = {payment: 0, principal: 0, interest: 0, balance: balance} ;
      if (balance > 0) {
        index = 1;
        periods = years * 12;
        aapr = apr / 1200;
        debt = sanitize(balance*(aapr/(1 - Math.pow((1 + aapr),periods)))*-1);
        interest = sanitize(balance*aapr) ;
        payment = debt + interest ;
        bln = (index === (periods + 1));
        while (!(balloon ? bln : (balance <= 0)) && (index <= periods)) {
          bln = (index == (periods + 1));
          interest = balance * aapr;
          debt = ((balloon && bln) || (payment > balance)) ? 
                   balance : 
                   payment - interest;
          payment = ((balloon && bln) || (payment > balance)) ?
                      interest + debt : 
                      payment;
          balance = ((balloon && bln) || (payment >= balance)) ?
                      0 :
                      balance - debt;
          coll[index] = { payment: sanitize(payment), 
                          principal: sanitize(debt),
                          interest: sanitize(interest),
                          balance: sanitize(balance) } ;
          index += 1;
        }
      }
      return coll ;
    },

    /**
     * Returns the sales to assets ratio
     *
     * @return   {float}
     * @param    {float} sales
     * @param    {float} assets
     */
    assetTurnover: function(sales, assets) {
      var r = 0;
      sales = parseFloat(sales);
      assets = parseFloat(assets);
      if (parseFloat(sales) && parseFloat(assets)) {
        r = (sales / assets);
      }
      return r;
    },

    /**
     * Returns a break-even point
     *
     * @return   {float}
     * @param    {float} fixedCost
     * @param    {float} sellingPrice
     * @param    {float} variableCost
     */
    breakEvenPoint: function(fixedCost, sellingPrice, variableCost) {
      // calculate the point at which you start making a profit given
      // the fixed costs (e.g. rent) and variable costs (e.g. material cost)
      // associated with production and the selling price of the item.

      var r = 0;
      if (parseFloat(fixedCost) &&
          parseFloat(sellingPrince) &&
          parseFloat(variableCost) &&
          sellingPrice - variableCost !== 0) {
        r = (fixedCost/(sellingPrice - variableCost)) ;
      }
      return r;
    },

    /**
     * Returns the ratio of working capital to assets
     *
     * @return   {float}
     * @param    {float} capital
     * @param    {float} assets
     */
    capitalLiquidity: function(capital, assets) {
      var r = 0;
      if (parseFloat(capital) && parseFloat(assets)) {
        r = (capital / assets);
      }
      return r;
    },

    /**
     * Returns the interest compounded for the specified number of periods
     *
     * @return   {float}
     * @param    {float} principal  Amount invested
     * @param    {float} apr        The annual percentage rate
     * @param    {integer} periods  Number of periods investment is held
     */
    compoundInterest: function(principal, apr, periods) {
      var r = 0;
      if (parseFloat(principal) && parseFloat(apr) && parseFloat(periods)) {
        r = (principal * Math.pow((1 + apr), periods));
      }
      return r;
    },

    /**
     * Returns the debt equity ratio
     *
     * @return   {float}
     * @param    {float} liabilities
     * @param    {float} equity
     */
    debtEquity: function(liabilities, equity) {
      var r = 0;
      if (parseFloat(liabilities) && parseFloat(equity)) {
        r = (liabilities / equity);
      }
      return r;
    },

    /**
     * Returns the owner's equity or net worth
     *
     * @return   {float}
     * @param    {float} assets
     * @param    {float} liabilities
     */
    equity: function(assets, liabilities) {
      var r = 0;
      if (!isNaN(assets) &&
          !isNaN(liabilities)) {
        r = (assets - liabilities);
      }
      return r;
    },

    /**
     * Returns the future value of an annuity
     *
     * @return   {float}
     * @param    {float} payment
     * @param    {float} apr
     * @param    {integer} periods
     */
    futureValue: function(payment, apr, periods) {
      var r = 0;
      if (parseFloat(apr) && !isNaN(payment) && !isNaN(periods)) {
        r = payment * ((Math.pow((1 + apr), periods) - 1)/apr);
      }
      return r;
    },

    /**
     * Returns the profit margin
     *
     * @return   {float}
     * @param    {float} profit
     * @param    {float} sales
     */
    profitMargin: function(profit, sales) {
      var r = 0;
      if (parseFloat(profit) && parseFloat(sales)) {
        r = (profit / sales);
      }
      return r;
    },

    /**
     * Returns the ratio of retained earnings to assets. A ratio >= 1 indicates growth is sustainable (growth financed by profits).
     *
     * @return   {float}
     * @param    {float} earnings
     * @param    {float} assets
     */
    retainedEarnings: function(retainedEarnings, assets) {
      var r = 0;
      if (parseFloat(retainedEarnings) && parseFloat(assets)) {
        r = (retainedEarnings / assets);
      }
      return r;
    },

    /**
     * Returns the Return on Assets (ROA)
     *
     * @return   {float}
     * @param    {float} earnings
     * @param    {float} assets
     */
    returnOnAssets: function(earnings, assets) {
      var r = 0;
      if (parseFloat(earnings) && parseFloat(assets)) {
        r = (earnings / assets);
      }
      return r;
    },

    
    /**
     * Returns the Return on Equity (ROE)
     *
     * @return   {float}
     * @param    {float} profit
     * @param    {float} equity
     */
    returnOnEquity: function(profit, equity) {
      var r = 0;
      if (parseFloat(profit) && parseFloat(equity)) {
        r = (profit / equity);
      }
      return r;
    },

    /**
     * Returns the amount of time or the APR required to double an investment
     *
     * @return   {string}
     * @param    {float} amount  Amount to invest
     * @param    {boolean} bAPR  Return the APR required
     */
    ruleOfSeventyTwo: function(amount, bAPR) {
      var fRate = (72/(amount || 1))
        , mos
        , yrs
        , r
      ;

      function plural(amt) {
        return (amt === 1 ? '' : 's');
      }

      mos = Math.floor(Math.round((fRate - Math.floor(fRate))*12));
      yrs = Math.floor(fRate) + " year" + plural(Math.floor(fRate));

      bAPR = (bAPR === true);
      if (amount > 0) {
        yrs = yrs + mos + " month" + plural(mos);
        r = bAPR ? fRate.toString() + "%" : yrs;
      }
      return r;
    },

    /**
     * Returns the Altman Z Score for a company.
     *
     * @return   {float}
     * @param    {float} earnings     Earnings for the period
     * @param    {float} sales        Sales for the period
     * @param    {float} equity       Owner's equity
     * @param    {float} capital      Working capital
     * @param    {float} retained     Retained earnings
     * @param    {float} assets       Assets held by the organization
     * @param    {float} liabilities  Liabilities held by the organization
     */
    zScore: function(earnings, sales, equity, capital, retained, assets, liabilities) {
      var r;
      if ( !isNaN(assets) && 
           !isNaN(capital) && 
           !isNaN(earnings) && 
           !isNaN(equity) && 
           !isNaN(liabilities) && 
           !isNaN(retained) && 
           !isNaN(sales) ) {
        r = (this.returnOnAssets(earnings, assets) * 3.3) + 
          (this.assetTurnover(sales, assets) * 0.999) + 
          (this.debtEquityInverse(liabilities, equity) * .6) + 
          (this.capitalLiquidity(capital, assets) * 1.2) + 
          (this.retainedEarnings(retained, assets) * 1.4);
      }
      return r;
    }
  };

  return Cathmhaol;
}));
