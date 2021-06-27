// JavaScriptを記述しましょう。
class View{
    static config = {
        gameDiv : document.getElementById("gameDiv"),
        loginForm : document.getElementById("loginForm"),
        roundStartPage : document.getElementById("roundStartPage"),
        suitImgURL : {
            "S" : "https://recursionist.io/img/spade.png",
            "H" : "https://recursionist.io/img/heart.png",
            "C" : "https://recursionist.io/img/clover.png",
            "D" : "https://recursionist.io/img/diamond.png",
            "?" : "https://recursionist.io/img/questionMark.png"
        },
        playerId : {
            0 : "nonCurPlayer1Div",
            1 : "curPlayerDiv",
            2 : "nonCurPlayer2Div",
            3 : "houseDiv"
        },

    }

    static displayNone(ele){
        ele.classList.remove("d-block");
        ele.classList.add("d-none");
    }

    static displayBlock(ele){
        ele.classList.remove("d-none");
        ele.classList.add("d-block");
    }

    static topPage(){
        View.config.loginForm.innerHTML = `
        <p class="text-white" > Welcome to Card Game! </p>
            <!-- name field div -->
            <div>
                <input type="text" placeholder="name" value="">
            </div>
            <!-- game type div -->
            <div>
                <select class="w-100">
                    <option value="blackjack">Blackjack </option>
                    <!-- <option value="poker">Poker </option> -->
                </select>
            </div>
            <!-- submit div -->
            <div>
                <!-- <a href="" class="btn btn-success">Start Game </a> -->
                <!-- <form id="game-form" class="form" onsubmit="">                 -->
                <button type="submit" class="btn btn-success">Start Game</button>
                <!-- </form> -->
            </div>
        `
    }

    static inputUserName(table){
        // Nameに何も入力しなかった場合Default名Jiroで始まる。
        let btn = View.config.loginForm.querySelectorAll("button")[0];       
        
        btn.addEventListener("click",()=>{
            let name = View.config.loginForm.querySelectorAll("input")[0].value;

            if (name === "") View.config.loginForm.querySelectorAll("input")[0].value = "Jiro";

            if (name === 'house' || name === 'ai1' || name === 'ai2'){
                window.alert("input another name. This name is unavailable.");
            } else {
                View.goToRoundStartPage(table);
            }
        })
    }

    static goToRoundStartPage(table){
        View.displayNone(View.config.loginForm);
        Controller.playerInfoSet(table);
        View.makeTableView(table);        
        View.displayBlock(View.config.roundStartPage);
    }

    static makeTableView(table){
        Controller.distributeCards(table)
        View.config.roundStartPage.innerHTML = `
        <div id="houseDiv" class="pt-5">

        </div>
        <div class="">

            <!-- Players Div -->
            <div id="playersDiv" class="d-flex justify-content-center">

                <!-- nonCurPlayerDiv 1-->
                <div id="nonCurPlayer1Div" class="flex-column">
                </div><!-- end player -->

                <!-- curPlayerDiv -->
                <div id = "curPlayerDiv" class="flex-column w-50">
                </div><!-- end player -->

                <!-- nonCurPlayer2Div -->
                <div id="nonCurPlayer2Div" class="flex-column">
                </div><!-- end player -->
            </div><!-- end players -->

            <!-- actionsAndBetsDiv -->
            <div id="actionsAndBetsDiv" class="d-flex pb-5 pt-4 justify-content-center">
            </div><!-- end actionsAndBetsDiv-->
            <!-- resultStorage -->
            <div id="resultDiv" class="d-flex pb-5 pt-4 justify-content-center text-white overflow-auto" style="max-height: 120px;">
            </div>
        </div>
        
        `

        // CardをMaskする
        for (let i = 0; i < table.players.length; i++){
                View.makePlayerCard(View.config.playerId[i], table.players[i],table);
                Controller.selectMaskCard(View.config.playerId[i]+"CardDiv",table.players[i].hand,[0,1]);
        }

        // Bet用のボタンを作成する
        document.getElementById("actionsAndBetsDiv").append(View.makeBetsDiv());

        for (let i = 0; i < table.betDenominations.length; i++){
            let target = document.getElementById("betsDivChild");
            target.append(View.makeBetChoiceDiv(i, table.betDenominations[i]));
        }

        Controller.decisionBet(table);
        Controller.transferToActionPage(table);
    }

    static makePlayerCard(id, player,table){
        let target = document.getElementById(id);
        let cardId = id + "CardDiv";
        let playerInfoId = id + "PlayerInfoDiv";
        let playerNameId = id + "PlayerName";
        target.innerHTML = "";
        if (player !== table.players[table.players.length-1]){
            target.innerHTML = `
                <p id="${playerNameId}" class="m-0 text-white text-center rem3">${player.name}</p>

                <!-- playerInfoDiv -->
                <div id="${playerInfoId}" class="text-white d-flex m-0 p-0 justify-content-center">
                    <p class="rem1 text-left">S:${player.tempAction},&ensp; </p>
                    <p class="rem1 text-left">B:${player.bet},&ensp; </p>
                    <p class="rem1 text-left">R:${player.chips} </p>
                </div>
                <!-- cardsDiv -->
                <div id="${cardId}" class="d-flex justify-content-center">
                </div><!-- end Cards -->
            ` 
        } else {
            // console.log("yahoo");
            target.innerHTML = `
                <p id="${playerNameId}" class="m-0 text-white text-center rem3">${player.name}</p>

                <!-- playerInfoDiv -->
                <div id="${playerInfoId}" class="text-white d-flex m-0 p-0 justify-content-center">
                    <p class="rem1 text-left">S:${player.tempAction},&ensp; </p>
                </div>
                <!-- cardsDiv -->
                <div id="${cardId}" class="d-flex justify-content-center">
                </div><!-- end Cards -->
            ` 
        }
        
    }

    static coloringPlayerNameOn(id){
        let playerNameId = id + "PlayerName";
        let target = document.getElementById(playerNameId);

        target.classList.remove("text-white");
        target.classList.add("text-warning");
    }

    static coloringPlayerNameOff(id){
        let playerNameId = id + "PlayerName";
        let target = document.getElementById(playerNameId);

        target.classList.remove("text-warning");
        target.classList.add("text-white");
    }

    static refreshPlayerStatus(id, player){
        let playerInfoId = id + "PlayerInfoDiv";
        let target = document.getElementById(playerInfoId);
        target.innerHTML = "";
        target.innerHTML = `
            <p class="rem1 text-left">S:${player.tempAction},&ensp; </p>
            <p class="rem1 text-left">B:${player.bet},&ensp; </p>
            <p class="rem1 text-left">R:${player.chips} </p>
        `
    }

    static refreshHouseStatus(id, player){
        let playerInfoId = id + "PlayerInfoDiv";
        let target = document.getElementById(playerInfoId);
        target.innerHTML = "";
        target.innerHTML = `
            <p class="rem1 text-left">S:${player.tempAction},&ensp; </p>
        `
    }   

    static makeBetChoiceDiv(num, money){
        let target = document.createElement("div");
        target.id = "betChoiceDiv" + num;
        target.innerHTML = `
            <div id="${target.id}">
                <div class="input-group" >
                    <span class="input-group-btn">
                        <button type="button" class="btn btn-danger btn-number">
                            -
                        </button>
                    </span>
                    <input type="text" class="input-number text-center" size="2" maxlength="5" value="0">
                    <span class="input-group-btn">
                        <button type="button" class="btn btn-success btn-number">
                            +
                        </button>
                    </span>
                </div><!--end input group div -->
                <p class="text-white text-center">${money}</p>
            </div> <!-- end betChoiceDiv -->
        `
        return target;
    }



    static makeBetsDiv(){
        let betsDiv = document.createElement("Div");
        betsDiv.classList.add("d-flex", "flex-column","w-50");
        betsDiv.id = "betsDiv";
        
        betsDiv.innerHTML = `
        <!-- betsDiv -->
        <!-- bottom half of bets including chip increments and submit  -->
        <div id="betsDivChild" class="py-2 h-60 d-flex justify-content-between">            
        </div><!-- end bestSelectionDiv -->
        <!-- betSubmitDiv -->
        <div id="betSubmitDiv" class="w-100 btn btn-success rem5 text-center bg-primary">
            Submit your bet
        </div><!-- end betSubmitDiv -->
        `
        return betsDiv;
    }

    static makeCardDiv(card, isMask){
        let cardDiv = document.createElement("div");
        cardDiv.classList.add("bg-white","border","mx-2");
        let suit = isMask ? "?" : card.suit;
        let rank = isMask ? "?" : card.rank;

        cardDiv.innerHTML = `
            <div class="text-center">
                <img src="${View.config.suitImgURL[suit]}" alt="" width="50" height="50">
            </div>
            <div class="text-center">
                <p class="m-0 ">${rank}</p>
            </div>
        `
        return cardDiv;
    }

    static insertCardDivToPlayerDiv(id, card, isMask){
        let targetId = document.getElementById(id);
        targetId.append(View.makeCardDiv(card, isMask));
    }

    static makeActionBtn(){
        let target = document.getElementById("actionsAndBetsDiv");
        target.innerHTML = "";
        target.innerHTML = `
        <!-- actionsDiv -->
            <div id ="actionsDiv" class="d-flex flex-wrap w-70">
                <div class="py-2">
                    <a id="surrenderBtn" class="text-dark btn btn-light px-5 py-1">surrender</a>
                </div>
                <div class="py-2">
                    <a id="standBtn" class="btn btn-success px-5 py-1">stand</a>
                </div>
                <div class="py-2">
                    <a id="hitBtn" class="btn btn-warning px-5 py-1">hit</a>
                </div>
                <div class="py-2">
                    <a id="doubleBtn" class="btn btn-danger px-5 py-1">double</a>
                </div>
            </div> <!-- end actionsDiv -->
        `
    }

    static makeNextRoundBtn(table){
        let target = document.getElementById("actionsAndBetsDiv");
        target.innerHTML = "";
        target.innerHTML = `
            <div class=py-2 d-flex justify-content-center">
                <a id="nextBtn" class="btn btn-primary px-5 py-1">next round</a>
            </div>
        `
        document.getElementById("nextBtn").addEventListener("click",()=>{
            table.blackjackClearPlayerHandsAndBets();
            table.deck.reListDeck();
            table.deck.shuffle();
            table.gamePhase = 'roundOver';
            View.makeTableView(table);
        })
    }
}

class Controller{
    static initializeApp(){
        View.topPage();
        let table = new Table(View.config.loginForm.querySelectorAll("select")[0].value);
        View.inputUserName(table);
    }

    static playerInfoSet(table){
        // playersとHouseの初期化
        let userName = View.config.loginForm.querySelectorAll("input")[0].value;
        table.house = new Player('Dealer', 'house', table.gameType);
        table.players.push(new Player("ai1", 'ai', table.gameType));
        table.players.push(new Player(userName, userName === "ai" ? "ai" : "user", table.gameType));
        table.players.push(new Player('ai2', 'ai', table.gameType));
        table.players.push(table.house);

    }

    static distributeCards(table){
        table.blackjackAssignPlayerHands();
    }

    // id: string, hand: Card[], maskList: int[] -> null (choise to mask cards in the hands)
    static selectMaskCard(id, hand, maskList){
        let count = 0;
        let targetDiv = document.getElementById(id);
        targetDiv.innerHTML = "";
        for (let card of hand){
            let flag;
            if (maskList.includes(count)) flag = true;
            else flag = false;
            View.insertCardDivToPlayerDiv(id,card,flag);
            count++;
        }
    }

    static bettingAiPlayer(player){
        if(player.type === "ai"){
            if(player.chips > 100) player.bet = 100;
            else if (player.chips > 50) player.bet = 50;
            else if (player.chips > 20) player.bet = 20;
            else player.bet = 5; 
        }
    }

    static bettingBtnEventForUser(num, player,table){
        if (player.type === "user"){
            let target = document.getElementById(`betChoiceDiv${num}`);
            let moneyUnit = table.betDenominations[num];
            let minusBtn = target.querySelectorAll("button")[0];
            let plusBtn = target.querySelectorAll("button")[1];
            let amountDiv = target.querySelectorAll("input")[0];
            
            let submitDiv = document.getElementById("betSubmitDiv");

            minusBtn.addEventListener("click",()=>{
                if (parseInt(amountDiv.value) > 0){
                    amountDiv.value = parseInt(amountDiv.value)-1;
                    player.bet -= moneyUnit;
                    submitDiv.innerHTML = "";
                    submitDiv.innerHTML = "Submit your bet for " + player.bet;
                    // console.log(player.bet);
                }
            })

            plusBtn.addEventListener("click",()=>{
                if (moneyUnit + player.bet <= player.chips){
                    amountDiv.value = parseInt(amountDiv.value)+1;
                    player.bet += moneyUnit;
                    submitDiv.innerHTML = "";
                    submitDiv.innerHTML = "Submit your bet for " + player.bet;
                    // console.log(player.bet);
                }       
            })
        }        
    }

    static areAllPlayersBettingMoreThanZero(table){
        for (let i = 0; i < table.players.length-1; i++){
            if (table.players[i].bet === 0) return false;
        }
        return true;
    }

    static decisionBet(table){
        for (let i = 0; i < table.players.length; i++){
            if (table.players[i].type === "user"){
                for (let j = 0; j < table.betDenominations.length; j++){
                    Controller.bettingBtnEventForUser(j, table.players[i],table);
                }
            } else if (table.players[i].type === "ai"){
                Controller.bettingAiPlayer(table.players[i]);
            }
        }
    }

    static transferToActionPage(table){
        let target = document.getElementById("betSubmitDiv");
        let btnsArea = document.getElementById("actionsAndBetsDiv");

        target.addEventListener("click",()=>{
            // Maskの解除※houseの一枚だけはMaskのまま
            if (!Controller.areAllPlayersBettingMoreThanZero(table)) alert("Betting chips more than zero. Of course, you cannot bet chips more than your belonging chips.");
            else{
                for (let i = 0; i < table.players.length; i++){
                    if(i !== table.players.length-1) {
                        View.makePlayerCard(View.config.playerId[i], table.players[i],table);
                        Controller.selectMaskCard(View.config.playerId[i]+"CardDiv",table.players[i].hand,[]);
                    }
                    else{
                        View.makePlayerCard(View.config.playerId[i], table.players[i],table);
                        Controller.selectMaskCard(View.config.playerId[i]+"CardDiv",table.players[i].hand,[1]);
                    } 
                }
                btnsArea.innerHTML = "";
                View.makeActionBtn();
                table.haveTurn();
            }            
        })
    }

    static actionBtnEvent(player,table){
        console.log("player tempAction: " + player.tempAction);
        let actionList = ["surrender", "stand", "hit", "double"];
        let gameDecision = new GameDecision("", player.bet);
        for (let i = 0; i < actionList.length; i++){
            let target = document.getElementById(actionList[i] + "Btn");
            target.addEventListener("click",()=>{
                gameDecision.action = target.innerHTML;
                player.gameStatus = target.innerHTML;
                console.log(gameDecision.action);
                table.evaluateMoveSecond(player, gameDecision);
            })
        }
    }

    static afterClickHitBtn(){
        let actionList = ["surrender", "stand", "hit", "double"];
        for (let i = 0; i < actionList.length; i++){
            let target = document.getElementById(actionList[i] + "Btn");
            
            if (actionList[i] === "surrender" || actionList[i] === "double"){
                // console.log("btn disable " + player.tempAction);
                target.classList.add("disabled");
            }
        }
    }

    static allActionBtnDisabled(){
        let actionList = ["surrender", "stand", "hit", "double"];
        for (let i = 0; i < actionList.length; i++){
            let target = document.getElementById(actionList[i] + "Btn");
            target.classList.add("disabled");           
        }
    }

    static displayResult(str){
        let target = document.getElementById("resultDiv");
        target.innerHTML += str;
    }
}

/*
Blackjackの実装
前回作成したコードを使ってください。
*/
// 前回作成したコードをここに貼り付けてください。
class Card
{
    /*
       String suit : {"H", "D", "C", "S"}から選択
       String rank : {"A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"}から選択
    */
    constructor(suit, rank)
    {
        // スート
        this.suit = suit;
        // ランク
        this.rank = rank;
    }

    /*
       return Number : カードのランクを基準とした整数のスコア。
       
        2-10はそのまま数値を返します。
    　  {"J", "Q", "K"}を含む、フェースカードは10を返します。
        "A」が1なのか11なのかを判断するには手札全体の知識が必要なので、「A」はとりあえず11を返します。
    */

    getRankNumber()
    {
        //TODO: ここから挙動をコードしてください。
        switch(this.rank){
            case "A": return 11; break;
            case "J": return 10; break;
            case "Q": return 10; break;
            case "K": return 10; break;
            default: return parseInt(this.rank);
        }
    }

    toString(){
        return " suit: " + this.suit + ", rank: " + this.rank;
    }
}

class Deck
{
    /*
       String gameType : ゲームタイプの指定。{'blackjack'}から選択。
    */
    constructor(gameType)
    {
        // このデッキが扱うゲームタイプ
        this.gameType = gameType;

        // カードの配列
        this.cards = [];
        const suits = ["H", "D", "C", "S"];
        const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

        // ゲームタイプによって、カードを初期化してください。
        if (this.gameType === "blackjack"){
            for(let suit in suits){
                for(let rank in ranks){
                    this.cards.push(new Card(suits[suit], ranks[rank]));
                }
            }
        }

    }
    
    /*
       return null : このメソッドは、デッキの状態を更新します。

       カードがランダムな順番になるようにデッキをシャッフルします。
    */
    shuffle()
    {
        //TODO: ここから挙動をコードしてください。
        for (let i = 51; i >= 0; i--){
            let rand = Math.floor(Math.random()*52)
            let temp = this.cards[rand];
            this.cards[rand] = this.cards[i];
            this.cards[i] = temp;
        }
    }

    /*
       String gameType : どのゲームにリセットするか
       return null : このメソッドは、デッキの状態を更新します。
    */
    reListDeck()
    {
        //TODO: ここから挙動をコードしてください。
        if (this.gameType === "blackjack") this.cards = new Deck("blackjack").cards;
    }
    
    /*
       return Card : ポップされたカードを返します。
       カード配列から先頭のカード要素をポップして返します。
    */
    drawOne()
    {
        //TODO: code behavior here
        let temp = this.cards.shift();
        return temp;
    }
}

class Player
{
    /*
        String name : プレイヤーの名前
        String type : プレイヤータイプ。{'ai', 'user', 'house'}から選択。
        String gameType : {'blackjack'}から選択。プレイヤーの初期化方法を決定するために使用されます。
        ?Number chips : ゲーム開始に必要なチップ。デフォルトは400。
    */
    constructor(name, type, gameType, chips = 400)
    {
        // プレイヤーの名前
        this.name = name;

        // プレイヤーのタイプ
        this.type = type;

        // 現在のゲームタイプ
        this.gameType = gameType;

        // プレイヤーの手札
        this.hand = [];

        // プレイヤーが所持しているチップ。
        this.chips = chips;

        // 現在のラウンドでのベットしているチップ
        this.bet = 0;

        // 勝利金額。正の数にも負の数にもなります。
        this.winAmount = 0;

        // プレイヤーのゲームの状態やアクションを表します。
        // ブラックジャックの場合、最初の状態は「betting」です。
        this.gameStatus = 'betting';

        // プレイヤーの現状スコアを表します。(consoleで確認したかっただけ、最終的には削除する)
        this.playerScore = this.getHandScore();

        // 最終的に決めたアクション stand, bust, double, blackjackのいずれか.初期値はbetting
        if (this.type === "house") this.tempAction = "waiting";
        else this.tempAction = "betting";
    }

    /*
       ?Number userData : モデル外から渡されるパラメータ。nullになることもあります。
       return GameDecision : 状態を考慮した上で、プレイヤーが行った決定。

        このメソッドは、どのようなベットやアクションを取るべきかというプレイヤーの決定を取得します。プレイヤーのタイプ、ハンド、チップの状態を読み取り、GameDecisionを返します。パラメータにuserData使うことによって、プレイヤーが「user」の場合、このメソッドにユーザーの情報を渡すことができますし、プレイヤーが 「ai」の場合、 userDataがデフォルトとしてnullを使います。
    */
    promptPlayer(userData)
    {
        //TODO: ここから挙動をコードしてください。
        if (this.gameStatus === 'betting'){
            
            switch(this.type){
                case("user"):
                    // user時はボタンクリックで選択するのでここはダミーで入れておく
                    return new GameDecision(userData.tempAction,this.bet);
                    break;
                case("house"):
                    if (this.getHandScore() > 17){
                        return new GameDecision("stand", 0);
                    }
                    return new GameDecision("hit",0);
                    break;
                case("ai"): //ai's mind is same as House's one.    
                    if (this.getHandScore() > 17){
                        return new GameDecision("stand", this.bet);
                    }
                    if (this.getHandScore() === 10 && this.hand.length === 2){
                        return new GameDecision("double",this.bet);
                    }
                    return new GameDecision("hit",this.bet);
                    break;
                default: return;
            }
        } else {
            return new GameDecision("decided", this.bet);
        }
    }

    /*
       return Number : 手札の合計

       合計が21を超える場合、手札の各エースについて、合計が21以下になるまで10を引きます。
    */
    getHandScore()
    {
        //TODO: ここから挙動をコードしてください。
        let score = 0;
        for(let i = 0; i < this.hand.length; i++){
            score += this.hand[i].getRankNumber();
        }
        
        let aces = this.howManyAceCard();
        while (aces > 0){
            if (score > 21){
                score -= 10;
                aces--;
            } else break;
        }

        this.playerScore = score;
        return score;
    }
    
    /*
      return Number: 手札に何枚のAが含まれるかを返す

    */
    howManyAceCard(){
        let count = 0;
        this.hand.forEach(x=>{
            if(x.rank === "A") count++;
        });
        return count;
    }

    /*
      return boolean: 手札がBlackJackかどうか

    */
    isBlackJack(){
        let flag = false;
        if(this.howManyAceCard()===1 && this.getHandScore()===21 && this.hand.length === 2){
            flag = true;
            this.hand.forEach(x=>{
                if (x.rank === "10") flag = false;
            })
        }
        return flag;
    }

}

class GameDecision
{
    /*
       String action : プレイヤーのアクションの選択。（ブラックジャックでは、hit、standなど。）
       Number amount : プレイヤーが選択する数値。

       これはPlayer.promptPlayer()は常にreturnする、標準化されたフォーマットです。
    */
    constructor(action, amount)
    {
        // アクション
        this.action = action;
        // プレイヤーが選択する数値
        this.amount = amount;
    }
}
class Table
{
    /*
       String gameType : {"blackjack"}から選択。
       Array betDenominations : プレイヤーが選択できるベットの単位。デフォルトは[5,20,50,100]。
       return Table : ゲームフェーズ、デッキ、プレイヤーが初期化されたテーブル
    */
    constructor(gameType, betDenominations = [5,20,50,100])
    {
        // ゲームタイプを表します。
        this.gameType = gameType;
        
        // プレイヤーが選択できるベットの単位。
        this.betDenominations = betDenominations;
        
        // テーブルのカードのデッキ
        this.deck = new Deck(this.gameType);
        this.deck.shuffle();

        // プレイしているゲームに応じて、プレイヤー、gamePhases、ハウスの表現が異なるかもしれません。
        // 今回はとりあえず3人のAIプレイヤーとハウス、「betting」フェースの始まりにコミットしましょう。
        this.players = [];
        
        // プレイヤーをここで初期化してください。
        // Controller.playerInfoSet()で定義。
        
        this.gamePhase = 'betting';

        // これは各ラウンドの結果をログに記録するための文字列の配列です。
        this.resultsLog = [];

        // ラウンドの回数をカウント
        this.turnCounter = 0;

    }

    evaluateMoveSecond(player, tempGameDisicion){
        // console.log("action: " + tempGameDisicion.action + ", bet: " + tempGameDisicion.amount);
        let num = this.getPlayerIdIndex(player);
        player.bet = parseInt(tempGameDisicion.amount);
            
        if (tempGameDisicion.action === "hit"){
            player.hand.push(this.deck.drawOne());
            player.tempAction = "hit";
            View.makePlayerCard(View.config.playerId[num], this.players[num],this);
            Controller.selectMaskCard(View.config.playerId[num]+"CardDiv",this.players[num].hand,[]);
        }

        if (player.getHandScore() > 21){
            player.gameStatus = "bust";
            player.tempAction = "bust";      
        }

        if (tempGameDisicion.action === "stand" && player.getHandScore() <= 21){
            player.tempAction = "stand";
            if (player.isBlackJack()) player.tempAction = "blackjack";
            player.gameStatus = "stand";
        }

        if (tempGameDisicion.action === "double"){
            player.hand.push(this.deck.drawOne());
            View.makePlayerCard(View.config.playerId[num], this.players[num],this);
            Controller.selectMaskCard(View.config.playerId[num]+"CardDiv",this.players[num].hand,[]);
            player.tempAction = "double";
            player.gameStatus = "stand";
            player.bet *= 2;
        }

        if (tempGameDisicion.action === "surrender"){
            player.gameStatus = "bust";
            player.tempAction = "surrender";
            player.bet *= 0.5;
        }

        if (player.type === "user"){
            // console.log("userTurn()だよ")
            // console.log(player.gameStatus);
            View.coloringPlayerNameOn(View.config.playerId[this.getPlayerIdIndex(player)]);
            View.refreshPlayerStatus(View.config.playerId[this.getPlayerIdIndex(player)], player);
            if (player.tempAction === "hit") Controller.afterClickHitBtn();
            if (this.isThisPlayerActionsResolved(player)){
                this.userTurn(player, this.isThisPlayerActionsResolved(player), this.getPlayerIdIndex(player));//userのActionが決定したら次のPlayerにターンを渡す
            } 
        }
    }
    /*
        Player player : テーブルは、Player.promptPlayer()を使用してGameDecisionを取得し、GameDecisionとgameTypeに応じてPlayerの状態を更新します。
        return Null : このメソッドは、プレーヤの状態を更新するだけです。

        EX:
        プレイヤーが「ヒット」し、手札が21以上の場合、gameStatusを「バスト」に設定し、チップからベットを引きます。
    */
    evaluateMove(player)
    {
        //TODO: ここから挙動をコードしてください。       
        if (player.type === "ai" || player.type === "house") this.evaluateMoveSecond(player, player.promptPlayer());
        else if(player.type === "user") Controller.actionBtnEvent(player,this);
    }

    /*
       return String : 新しいターンが始まる直前の全プレイヤーの状態を表す文字列。
        NOTE: このメソッドの出力は、各ラウンドの終了時にテーブルのresultsLogメンバを更新するために使用されます。
    */
    blackjackEvaluateAndGetRoundResults()
    {
        //TODO: ここから挙動をコードしてください。
        let str = "***** Round " + this.turnCounter + " ********<br>";
        for (let i = 0; i < this.players.length-1; i++){
            str += " ["+ i + "] name: " +  this.players[i].name + ", action: " + this.players[i].tempAction + ", chips: " + this.players[i].chips + ", bet: " + this.players[i].bet + ", won: " + this.players[i].winAmount +  "<br>";
        }
        return str;
    }

    /*
       return null : デッキから2枚のカードを手札に加えることで、全プレイヤーの状態を更新します。
       NOTE: プレイヤーのタイプが「ハウス」の場合は、別の処理を行う必要があります。
    */
    blackjackAssignPlayerHands()
    {
        //TODO: ここから挙動をコードしてください。
        for(let i = 0; i < this.players.length; i++){
            this.players[i].hand.push(this.deck.drawOne());
            this.players[i].hand.push(this.deck.drawOne());
        }
    }

    /*
       return null : テーブル内のすべてのプレイヤーの状態を更新し、手札を空の配列に、ベットを0に設定します。
    */
    blackjackClearPlayerHandsAndBets()
    {
        //TODO: ここから挙動をコードしてください。
        for(let i = 0; i < this.players.length; i++){
            this.players[i].bet = 0;
            this.players[i].gameStatus = 'betting';
            this.players[i].hand = [];
            this.players[i].winAmount = 0;
            if(this.players[i].type !== "house") this.players[i].tempAction = "betting";
            else this.players[i].tempAction = "waiting";
        }
    }
    

    aiTurn(player, flag, i){
        if(!flag){
            this.evaluateMove(player);
            View.coloringPlayerNameOn(View.config.playerId[this.getPlayerIdIndex(player)]);

            setTimeout(x=>{
                this.aiTurn(x, this.isThisPlayerActionsResolved(x), i);
                View.refreshPlayerStatus(View.config.playerId[this.getPlayerIdIndex(x)], x);
            },2000, player);
        } else {
            let nextPlayer = this.getTurnPlayer();
            View.coloringPlayerNameOff(View.config.playerId[this.getPlayerIdIndex(player)]);
            new Promise((resolve, reject)=>{
                resolve(nextPlayer);
                reject("error");
            }).then((val)=>this.playerActionLoop(val, i+1));
        }
    }

    houseTurn(player, flag, i){
        if(!flag){
            this.evaluateMove(player);
            View.coloringPlayerNameOn(View.config.playerId[this.getPlayerIdIndex(player)]);

            setTimeout(x=>{
                this.houseTurn(x, this.isThisPlayerActionsResolved(x), i);
                View.refreshHouseStatus(View.config.playerId[this.getPlayerIdIndex(x)], x);
            },2000, player);
        } else {
            console.log("finish " + this.house.tempAction);
            this.judgeResult();
            
        }
    }

    userTurn(player, flag, i){
        if(!flag){
            new Promise((resolve)=>{
                resolve(player);
            }).then(x=>{
                return this.evaluateMove(x);
                })
            .catch(()=>console.log("error of userTurn()"));

        } else {
            let nextPlayer = this.getTurnPlayer();
            View.coloringPlayerNameOff(View.config.playerId[this.getPlayerIdIndex(player)]);
            Controller.allActionBtnDisabled();
            new Promise((resolve, reject)=>{
                resolve(nextPlayer);
                reject("error");
            }).then((val)=>this.playerActionLoop(val, i+1));
        }      
    }

    getPlayerIdIndex(player){
        let num = 0;
        for (let i = 0; i < this.players.length; i++){
            if (player.name === this.players[i].name){
                num = i;
                break;
            }
        }
        return num;
    }

    playerActionLoop(player, i){
        if (i <= this.players.length-2){
            View.coloringPlayerNameOn(View.config.playerId[this.getPlayerIdIndex(player)]);     
            setTimeout((x)=>{
                if (player.type === "ai"){
                    this.aiTurn(x, this.isThisPlayerActionsResolved(x), i);
                } else {
                    this.userTurn(x, this.isThisPlayerActionsResolved(x), i);
                }
            },100,player);
        } else{
            View.makePlayerCard(View.config.playerId[this.getPlayerIdIndex(player)], player,this);
            Controller.selectMaskCard(View.config.playerId[this.getPlayerIdIndex(player)]+"CardDiv",player.hand,[]);// Maskされていたカードを開く
            this.houseTurn(player, this.isThisPlayerActionsResolved(player),i);
        } 
    }

    /*
       Number userData : テーブルモデルの外部から渡されるデータです。 
       return Null : このメソッドはテーブルの状態を更新するだけで、値を返しません。
    */
    haveTurn(userData)
    {
        //TODO: ここから挙動をコードしてください。

        console.log("******************start****************");

        let currPlayer = this.getTurnPlayer();
        new Promise((resolve, reject)=>{
            resolve(currPlayer);
            reject();
        }).then((val)=>this.playerActionLoop(val, 0))
        .then(()=>console.log("correctly finished!")).catch(()=>console.log("error of haveTurn()"));
    }

    judgeResult(){
        // this.players's last index data is the one of "house", so for loop goes until this.players.length - 1.
        for(let i = 0; i < this.players.length-1; i++){
            if (this.judgeWinner(this.players[i], this.players[this.players.length-1]) && this.players[i].isBlackJack()) this.players[i].winAmount = this.players[i].bet * 1.5;
            else if(this.judgeWinner(this.players[i], this.players[this.players.length-1])) this.players[i].winAmount = this.players[i].bet;
            else if(this.players[i].getHandScore() === this.players[this.players.legnth-1]) this.players[i].winAmount = 0;
            else this.players[i].winAmount = -1 * this.players[i].bet;

            if (this.players[i].tempAction === "surrender") this.players[i].winAmount = -this.players[i].bet;

            this.players[i].chips += this.players[i].winAmount;
        }
        this.resultsLog += this.blackjackEvaluateAndGetRoundResults()
        Controller.displayResult(this.resultsLog);
        this.turnCounter++;
        View.makeNextRoundBtn(this);
    }

    /*
      Player player: Player data, Player house: House data
      return boolean : if player wins, it returns true. 
    */
    judgeWinner(player, house){
        if (player.isBlackJack() && !house.isBlackJack()) return true;
        if (!player.isBlackJack() && house.isBlackJack()) return false;
        if (player.getHandScore() > 21) return false;
        if (house.getHandScore() > 21) return true;
        if (player.getHandScore() > house.getHandScore()) return true;
        return false;
    }

    /*
       return Player : 現在のプレイヤー
    */
    getTurnPlayer()
    {
        //TODO: ここから挙動をコードしてください。
        for (let i = 0; i < this.players.length; i++){
            if (this.players[i % this.players.length].gameStatus === 'betting') return this.players[i % this.players.length];
        }
    }

    /*
        return Boolean : テーブルがプレイヤー配列の最初のプレイヤーにフォーカスされている場合はtrue、そうでない場合はfalseを返します。
    */
    onFirstPlayer()
    {
        //TODO: ここから挙動をコードしてください。
        return this.getTurnPlayer() === this.players[0];
    }

    /*
        return Boolean : テーブルがプレイヤー配列の最後のプレイヤーにフォーカスされている場合はtrue、そうでない場合はfalseを返します。
    */
    onLastPlayer()
    {
        //TODO: ここから挙動をコードしてください。
        return this.getTurnPlayer() === this.players[this.players.length-2];
    }
    
    /*
        全てのプレイヤーがセット{'broken', 'bust', 'stand', 'surrender'}のgameStatusを持っていればtrueを返し、持っていなければfalseを返します。
    */
    allPlayerActionsResolved()
    {
        //TODO: ここから挙動をコードしてください。
        let gameStatusList = ['broken', 'bust', 'stand', 'surrender', 'decided'];
        for (let i = 0; i < this.players.length; i++){
            if (!gameStatusList.includes(this.players[i].gameStatus)) return false;
        }
        return true;
    }

    /*
        指定のプレイヤーがセット{'broken', 'bust', 'stand', 'surrender'}のgameStatusを持っていればtrueを返し、持っていなければfalseを返します。
    */
    isThisPlayerActionsResolved(player)
    {
        //TODO: ここから挙動をコードしてください。
        let gameStatusList = ['broken', 'bust', 'stand', 'surrender', 'decided'];
        if (!gameStatusList.includes(player.gameStatus)) return false;
        return true;
    }
}

Controller.initializeApp();