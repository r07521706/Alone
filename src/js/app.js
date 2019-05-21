App = {
  web3Provider: null,

  contracts: {},

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {

        // Request account access
        await window.ethereum.enable();
      } catch (error) {
      // User denied account access...
      console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('ChickenStore.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var ChickenStoreArtifact = data;
      App.contracts.ChickenStore = TruffleContract(ChickenStoreArtifact);

      // Set the provider for our contract
      App.contracts.ChickenStore.setProvider(App.web3Provider);
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $("#account").html(web3.eth.accounts[0]);
    $(document).on('click', '.btn', App.addChicken);
    $(document).on('click', '.btn2', App.getChicken);
    $(document).on('click', '.btn-adopt', App.transfer);
    $(document).on('click', '.btn-dialog-close',App.diaClose);
    return App.render();
  },


  accountContent:function(){
    $("#account_div").css("display","inline");
  },
  accountClose:function(){
    $("#account_div").css("display","inline");
  },

  diaClose:function(){
    // alert("close");
    $("#dialog_div").css("display","none");
  },
  transfer:function(){
    // alert("transfer");

    $("#dialog_div").css("display","inline");

  },

  render:function(){
    var haveChicken=true;
    var chickenNumber=1;
    App.getChicken3();
    // while(haveChicken){
    //   // alert("hi");
    //   App.getChicken2(chickenNumber).then(function(result){
    //     alert("這是render");
    //     alert($("#temp-address").html());
    //     haveChicken=$("#temp-true").val();
    //     chickenNumber=chickenNumber+1;
    //   });
    // }
  },

  addChicken: function(event) {

    event.preventDefault();

    var name=$("#name").val();

    var image=$("#image").val();
    var service=$("#service").val();
    var price=$("#price").val();


    // var petId = parseInt($(event.target).data('id'));

    var chickenStore;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.ChickenStore.deployed().then(function(instance) {
        chickenStore = instance;
        // alert(image);
        // Execute adopt as a transaction by sending account
        return chickenStore.launch(name,image,service,price, {from: account});
      }).then(function(result) {

        return console.log(result[0]);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },


  getChicken: function(event) {
    event.preventDefault();

    // var name=$("#name").val();
    //
    // var image=$("#image").val();
    // var service=$("#service").val();
    // var price=$("#price").val();


    // var petId = parseInt($(event.target).data('id'));

    var chickenStore;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.ChickenStore.deployed().then(function(instance) {
        chickenStore = instance;

        // Execute adopt as a transaction by sending account
        return chickenStore.getChickenInformation(1);
      }).then(function(result) {

        return (result);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
  // getChicken:function(event){
  //     event.preventDefault();
  // //     web3.eth.getAccounts(function(error,accounts){
  // //       if(error){
  // //         console.log(error);
  // //       }
  // //       var account=accounts[0];
  // //
  // //       App.contracts.ChickenStore.deployed().then(function(instance){
  // //         chickenStore=instance;
  // //
  // //         return chickenStore.getChickenInformation(1);
  // //       }).then(function(reseult){
  // //         alert(result);
  // //       }).catch(function(err){
  // //         console.log(err.message);
  // //       });
  // //     });
  // };
  getChicken2: function(chickenNumber) {

    var chickenResult;
    var chickenStore;
    var s;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      //fun
      s=App.contracts.ChickenStore.deployed().then(function(instance) {
        chickenStore = instance;

        // Execute adopt as a transaction by sending account
        return chickenStore.getChickenInformation(chickenNumber);
      }).then(function(result) {
          console.log(result);
          var chickensRow = $('#chickensRow');
          var chickenTemplate = $('#chickenTemplate');
          // alert("hi");
          chickenTemplate.find('.panel-title').text(result[2]);
          chickenTemplate.find('.chicken-service').text(result[4]);
          chickenTemplate.find('.chicken-price').text(result[5].toString(10));
          chickenTemplate.find('.chicken-address').text(result[1]);
          chickensRow.append(chickenTemplate.html());


          // $("#temp-true").html(result[0]);
          // $("#temp-address").html(result[1]);
          // $("#temp-name").html(result[2]);
          // $("#temp-link").html(result[3]);
          // $("#temp-service").html(result[4]);
          // $("#temp-price").html(result[5].toString(10));
          chickenResult=result;
          // alert(chickenResult);
        return result;
      }).catch(function(err) {
        console.log(err.message);
      });


    });
    // alert(chickenResult);
    // return chickenResult;
  },

  getChicken3: function() {


    var chickenStore;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      //fun
      App.contracts.ChickenStore.deployed().then(function(instance) {
        chickenStore = instance;

        // Execute adopt as a transaction by sending account
        return chickenStore.numberOfSeller.call();
      }).then(function(result) {
          console.log(result);
          // $("#temp-true").html(result[0]);
          // $("#temp-address").html(result[1]);
          // $("#temp-name").html(result[2]);
          // $("#temp-link").html(result[3]);
          // $("#temp-service").html(result[4]);
          // $("#temp-price").html(result[5].toString(10));

          for(i=1;i<=result;i++){
            // alert(i);
            App.getChicken2(i);
          }
          // alert(chickenResult);
        return result;
      }).catch(function(err) {
        console.log(err.message);
      });


    });
    // alert(chickenResult);
    // return chickenResult;
  }

}


$(function() {
  $(window).load(function() {
    App.init();
  });
});
