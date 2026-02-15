import {useEffect, useState} from "react";
import type {Transaction} from "./App.tsx";

interface Props {
    onSuccess: () => void;
    editingTransaction: Transaction | null;
}

function TransactionForm({onSuccess, editingTransaction}: Props) {
    const [transactionDate, setTransactionData] = useState("");
    const [amount, setAmount] = useState(0);
    const [transactionType, setTransactionType] = useState("EXPENSE");
    const [memo, setMemo] = useState("");

    const handleSubmit = async (e: Event) => {
        e.preventDefault();

        const method = editingTransaction ? "PUT" : "POST";
        const url = editingTransaction
            ? `http://localhost:8080/api/transactions/${editingTransaction.transactionId}`
            : "http://localhost:8080/api/transactions";

        await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({transactionDate, amount, transactionType, memo})
        });

        onSuccess();
    };

    useEffect(() => {
        if (editingTransaction) {
            setTransactionData(editingTransaction.transactionDate);
            setAmount(editingTransaction.amount);
            setTransactionType(editingTransaction.transactionType);
            setMemo(editingTransaction.memo);
        } else {
            setTransactionData("");
            setAmount(0);
            setTransactionType("EXPENSE");
            setMemo("");
        }
    }, [editingTransaction]);

    return (
        <form onSubmit={handleSubmit}>
            <input type="date"
                   value={transactionDate}
                   onChange={(e) => setTransactionData(e.target.value)}
                   required/>

            <input type="number"
                   value={amount}
                   onChange={(e) => setAmount(Number(e.target.value))}
                   required
            />

            <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}>
                <option value="EXPENSE">支出</option>
                <option value="INCOME">収入</option>
            </select>

            <input
                type="text"
                placeholder={"メモ"}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
            />

            <button type={"submit"}>{editingTransaction ? "更新" : "登録"}</button>
        </form>
    );
}

export default TransactionForm;