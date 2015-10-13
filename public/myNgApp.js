angular.module('foodpoints', [])

  .controller("AdvancedStatsController", function($scope) {
    $scope.advanced = false;
  })

  .controller("MealPlanController", function($scope){
    $scope.mealPlans=[{
      name: "Plan H ($432, Freshmen)",
      value: 432
      },
      {
        name: "Plan I ($499, Freshmen)",
        value: 499
        },
      {
        name: "Plan A ($2062)",
        value: 2062
        },
      {
        name: "Plan B ($2473)",
        value: 2473
        },
      {
        name: "Plan C ($2738)",
        value: 2738
        },
      {
        name: "Plan D ($2938)",
        value: 2938
      },
      {
        name: "Plan E ($3204)",
        value: 3204
        },
      {
        name: "Plan F ($676, off-campus)",
        value: 676
        },
      {
        name: "Plan J ($1458, central, off-campus)",
        value: 1458
      }
    ];
    if (docCookies.getItem("foodplan")!==""){
      $scope.selectedItemName = docCookies.getItem("foodplan");
      var percent2 = Math.min($("#balance").text() / $scope.mealPlanCost, 1);
      $("#progbar2").width(percent2 * 100 + "%");
    }
    else {
      $scope.selectedItemName = "Choose meal plan";
    }
    // dynamically change progressbar size on change in food plan
    $scope.dropboxitemselected = function (thisItem) {
        $scope.selectedItemName = thisItem.name;
        $scope.mealPlanCost = thisItem.value;
        // alert($scope.selectedItemName);
        var percent2 = Math.min($("#balance").text() / $scope.mealPlanCost, 1);
        $("#progbar2").width(percent2 * 100 + "%");
        //store numfoodpoints and foodplan as cookies
        docCookies.setItem("numfoodpoints", $scope.mealPlanCost, 31536e3);
        docCookies.setItem("foodplan", $scope.selectedItemName, 31536e3);

        if (user && chart) {
            chart.load({
                columns: [
                    ['Ideal', $scope.mealPlanCost, 0]
                ]
            });
        }
        numfoodpoints = $scope.mealPlanCost; //necessary cos foodpoints.js does updates progress bar text with this
    };
  })

  .controller("AverageSpendingController", function($scope, $http) {
    $http.get('/api/spending')
      .then(function(response) {
        $scope.average = parseFloat(response.data).toFixed(2);
      }
  );
})

  .controller("BudgetController", function($scope, $http) {
    $http.get('/api/cutoffs/')
      .success(function(data, status, headers, config) {
        $scope.periods = Object.keys(data);
        $scope.budget = {
          amount: 150,
          period: 'week'
        };
      });
    getBudgets($scope, $http);
    $scope.save = function(budget) {
      console.log(budget);
      $http.post('/api/budgets/', budget)
        .success(function(data, status, headers, config) {
          console.log(data);
          getBudgets($scope, $http);
        });
    };
    $scope.delete = function(budget) {
      $http.delete('/api/budgets/' + budget._id)
        .success(function(data, status, headers, config) {
          console.log(data);
          getBudgets($scope, $http);
        });
    };
  });

  function getBudgets($scope, $http) {
      $http.get('/api/budgets/').
      success(function(data, status, headers, config) {
          data.forEach(function(b) {
              b.percent = Math.min(b.spent / b.amount * 100, 100);
              b.elapsed = moment().diff(b.cutoff) / moment.duration(1, b.period).asMilliseconds() * 100;
              var classes = ["progress-bar-success", "progress-bar", "progress-bar-striped", "active"];
              classes[0] = b.percent > b.elapsed ? "progress-bar-warning" : classes[0];
              b.class = classes.join(" ");
              b.display = b.spent.toFixed() + " of " + b.amount + " this " + b.period;
          });
          $scope.budgets = data;
      });
  }
