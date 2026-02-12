import {useState} from "react";

interface Props {
    onSuccess: () => void;
}

function TransactionForm({onSuccess}: Props) {
    const [transactionDate, setTransactionData] = useState("");
    const [amount, setAmount] = useState(0);
    const [transactionType, setTransactionType] = useState("EXPENSE");
    const [memo, setMemo] = useState("");

    const handleSubmit = async (e: Event) => {
        e.preventDefault();

        await fetch("http://localhost:8080/api/transactions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({transactionDate, amount, transactionType, memo})
        });

        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="date"
                   onChange={(e) => setTransactionData(e.target.value)}
                   required/>

            <input type="number"
                   onChange={(e) => setAmount(Number(e.target.value))}
                   required
            />

            <select onChange={(e) => setTransactionType(e.target.value)}>
                <option value="EXPENSE">支出</option>
                <option value="INCOME">収入</option>
            </select>

            <input type="text"
                   placeholder={"メモ"}
                   onChange={(e) => setMemo(e.target.value)}
            />

            <button type={"submit"}>登録</button>
        </form>
    );
}

export default TransactionForm;