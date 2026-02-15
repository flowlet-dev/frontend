import type {Transaction} from "./App.tsx";

interface Props {
    transactions: Transaction[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (transactionId: string) => void;
}

function TransactionList({transactions, onEdit, onDelete}: Props) {

    return (
        <ul>
            {transactions.map((transaction) => (
                <li key={transaction.transactionId}>
                    {transaction.transactionDate} | {transaction.amount} | {transaction.transactionType} | {transaction.memo}
                    <button onClick={() => onEdit(transaction)}>編集</button>
                    <button onClick={() => onDelete(transaction.transactionId)}> 削除</button>
                </li>
            ))}
        </ul>
    );

}

export default TransactionList;