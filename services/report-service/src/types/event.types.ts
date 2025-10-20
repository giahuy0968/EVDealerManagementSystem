export interface OrderCompletedEvent {
eventId: string;
type: 'order.completed';
data: {
    **orderId: string;**

    **dealerId: string;**

    **staffId?: string;**

    **customerId: string;**

    **modelId: string;**

    **quantity: number;**

    **totalAmount: number;**

    **profit: number;**

    **region: string;**

    **completedAt: Date;**

};
timestamp: Date;
}

export interface InventoryChangedEvent {
eventId: string;
type: 'inventory.changed';
data: {
    **inventoryId: string;**

    **dealerId: string;**

    **modelId: string;**

    **previousQuantity: number;**

    **newQuantity: number;**

    **value: number;**

    **changeType: 'INCREMENT' | 'DECREMENT' | 'SET';**

    **reason: string;**

    **changedAt: Date;**

};
timestamp: Date;
}

export interface CustomerCreatedEvent {
eventId: string;
type: 'customer.created';
data: {
    **customerId: string;**

    **dealerId: string;**

    **region: string;**

    **testDriveCount: number;**

    **source: string;**

    **createdAt: Date;**

};
timestamp: Date;
}

export interface PaymentReceivedEvent {
eventId: string;
type: 'payment.received';
data: {
    **paymentId: string;**

    **orderId: string;**

    **dealerId: string;**

    **amount: number;**

    **paymentMethod: string;**

    **receivedAt: Date;**
};
timestamp: Date;
}
