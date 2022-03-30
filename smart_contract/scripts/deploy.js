const main = async () => {
  const Transactions = await hre.ethers.getContractFactory("Transactions");
  const transactions = await Transactions.deploy();

  await transactions.deployed();

  console.log("Transactions deployed to:", transactions.address);
}


const runMain = async () => {
  try{
    //line 14 is going to deploy and await our contract
    await main(); 
    process.exit(0);
  } catch (error){
    console.error(error.message); 
    process.exit(1);
  }

}
runMain();