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

  initContract: async function() {
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

        // Execute adopt as a transaction by sending account
        return chickenStore.launch(name,image,service,price, {from: account});
      }).then(function(result) {

        return console.log(result);
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
      // alert(App.contracts.ChickenStore);
      App.contracts.ChickenStore.deployed().then(function(instance) {
        chickenStore = instance;
        alert(chickenStore);

        return chickenStore.getChickenInformation(1);
      }).then(function(result) {
        alert(result);
        //return result
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }
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

}


$(function() {
  $(window).load(function() {
    App.init();
  });
});
