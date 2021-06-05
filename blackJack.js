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
        if (this.gameType === "BlackJack"){
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
        if (this.gameType === "BlackJack") this.cards = new Deck("BlackJack").cards;
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
                    // 何か選択してアクションを決めるがよくわからないので、いったんこれを入れておく
                    this.bet = 20;
                    return new GameDecision("hit",this.bet);
                    break;
                case("house"):
                    this.bet = 20;
                    return　new GameDecision("hit",this.bet);
                    break;
                case("ai"):                  
                    if (this.getHandScore() > 17){
                        this.bet = 20;
                        return new GameDecision("stand", this.bet);
                    }
                    if (this.getHandScore() === 10){
                        this.bet = 20;
                        return new GameDecision("double",this.bet);
                    }
                    this.bet = 20;
                    return new GameDecision("hit",this.bet);
                    break;
                default: return;
            }
        } else {
            return new GameDecision("stand", this.bet);
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
        this.playerScore = score;
        return score;
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
        
        this.house = new Player('house', 'ai', this.gameType);
        this.players.push(new Player("player1", 'ai', this.gameType));
        this.players.push(new Player('player2', 'ai', this.gameType));
        this.players.push(new Player('player3', 'ai', this.gameType));
        this.players.push(this.house);
        this.gamePhase = 'betting';

        // これは各ラウンドの結果をログに記録するための文字列の配列です。
        this.resultsLog = [];

        this.turnCounter = 0;

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
        let tempGameDisicion = player.promptPlayer();
        player.bet = parseInt(tempGameDisicion.amount);
        if (tempGameDisicion.action === "hit"){
            player.hand.push(this.deck.drawOne());
            
        }

        if (player.getHandScore() > 21){
            player.gameStatus = "bust";
            player.chips -= player.bet;
            player.bet = 0;
        }

        if (tempGameDisicion.action === "stand" && player.getHandScore() <= 21){
            player.gameStatus = "stand";
        }

        if (tempGameDisicion.action === "double" && player.getHandScore() <= 21){
            player.hand.push(this.deck.drawOne());
            player.gameStatus = "stand";
            player.bet *= 2;
        }
    }

    /*
       return String : 新しいターンが始まる直前の全プレイヤーの状態を表す文字列。
        NOTE: このメソッドの出力は、各ラウンドの終了時にテーブルのresultsLogメンバを更新するために使用されます。
    */
    blackjackEvaluateAndGetRoundResults()
    {
        //TODO: ここから挙動をコードしてください。
        let str = "";
        for (let i = 0; i < this.players.length-1; i++){
            str += " ["+ i + "] name: " +  this.players[i].name + ", chips: " + this.players[i].chips + "\n";
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
        }
    }
    
    /*
       return Player : 現在のプレイヤー
    */
    getTurnPlayer()
    {
        //TODO: ここから挙動をコードしてください。
        for (let i = 0; i < this.players.length; i++){
            if (this.players[i % this.players.length].gameStatus === 'betting' || this.players[i % this.players.length].gameStatus === 'hit') return this.players[i % this.players.length];
        }
    }

    /*
       Number userData : テーブルモデルの外部から渡されるデータです。 
       return Null : このメソッドはテーブルの状態を更新するだけで、値を返しません。
    */
    haveTurn(userData)
    {
        //TODO: ここから挙動をコードしてください。
        this.blackjackAssignPlayerHands();
        let i = 0;

        console.log("******************start****************");
        while(!this.allPlayerActionsResolved()){
            this.evaluateMove(this.players[i % this.players.length]);
            console.log(this.players[i % this.players.length]);
            i++; 
        }

        // this.player's last index data is "house", so for loop goes until this.player.length - 1.
        for(let i = 0; i < this.players.length-1; i++){
            if (this.judgeWinner(this.players[i], this.players[this.players.length-1])) this.players[i].winAmount = this.players[i].bet;
            else this.players[i].winAmount = -1 * this.players[i].bet;

            this.players[i].chips += this.players[i].winAmount;
        }

        console.log(this.blackjackEvaluateAndGetRoundResults());

        this.gamePhase = 'roundOver';

    }

    /*
      Player player: Player data, Player house: House data
      return boolean : if player wins, it returns true. 
    */
    judgeWinner(player, house){
        if (player.getHandScore() > 21) return false;
        if (house.getHandScore() > 21) return true;
        if (player.getHandScore() > house.getHandScore()) return true;
        return false;
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
        return this.getTurnPlayer() === this.players[this.players.length-1];
    }
    
    /*
        全てのプレイヤーがセット{'broken', 'bust', 'stand', 'surrender'}のgameStatusを持っていればtrueを返し、持っていなければfalseを返します。
    */
    allPlayerActionsResolved()
    {
        //TODO: ここから挙動をコードしてください。
        let gameStatusList = ['broken', 'bust', 'stand', 'surrender'];
        for (let i = 0; i < this.players.length; i++){
            if (!gameStatusList.includes(this.players[i].gameStatus)) return false;
        }
        return true;
    }
}

let table = new Table("BlackJack");

// console.log("************initial******************")

// console.log(table.players);
// console.log(table.gamePhase);

console.log("************first round******************");
// table.haveTurn();
// console.log(table.players);
// console.log(table.gamePhase);
// while(table.gamePhase != 'roundOver'){
//     table.haveTurn();
// }
table.haveTurn();
// console.log(table.players);
console.log(table.gamePhase);