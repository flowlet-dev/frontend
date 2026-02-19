import {useEffect, useState} from "react";
import type {Transaction} from "./App.tsx";

interface Props {
    onSuccess: () => void;
    editingTransaction: Transaction | null;
}

type TransactionType = "EXPENSE" | "INCOME";

type FormState = {
    transactionDate: string;
    amount: number;
    transactionType: TransactionType;
    memo: string;
};

const emptyForm: FormState = {
    transactionDate: "",
    amount: 0,
    transactionType: "EXPENSE",
    memo: ""
};

function TransactionForm({onSuccess, editingTransaction}: Props) {
    const [form, setForm] = useState<FormState>(emptyForm);


    const handleSubmit = async (e: React.FormEvent) => {
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
            body: JSON.stringify(form)
        });

        onSuccess();
    };

    useEffect(() => {
        if (editingTransaction) {
            setForm({
                transactionDate: editingTransaction.transactionDate,
                amount: editingTransaction.amount,
                transactionType: editingTransaction.transactionType as TransactionType,
                memo: editingTransaction.memo
            });
            return;
        }

        setForm(emptyForm);

    }, [editingTransaction]);

    return (
        <form onSubmit={handleSubmit}>
            <input type="date"
                   value={form.transactionDate}
                   onChange={(e) => setForm((prev) => ({...prev, transactionDate: e.currentTarget.value}))}
                   required
            />

            <input type="number"
                   value={form.amount}
                   onChange={(e) => setForm((prev) => ({...prev, amount: Number(e.currentTarget.value)}))}
                   required
            />

            <select
                value={form.transactionType}
                onChange={(e) =>
                    setForm((prev) => ({...prev, transactionType: e.currentTarget.value as TransactionType}))
                }
            >
                <option value="EXPENSE">支出</option>
                <option value="INCOME">収入</option>
            </select>

            <input
                type="text"
                placeholder={"メモ"}
                value={form.memo}
                onChange={(e) => setForm((prev) => ({...prev, memo: e.currentTarget.value}))}
            />

            <button type={"submit"}>{editingTransaction ? "更新" : "登録"}</button>
        </form>
    );
}

export default TransactionForm;