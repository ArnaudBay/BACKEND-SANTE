export interface Medicine {

	id: string;
	name: string;             
	category: string;         
	price: number;           
	stock: number;            

	expirationDate: string;   
	description?: string;
}

export interface PharmacyRepository {
	create(medicine: Medicine): Promise<Medicine>;
	findById(id: string): Promise<Medicine | null>;
	findAll(): Promise<Medicine[]>;
	update(medicine: Medicine): Promise<Medicine>;
	delete(id: string): Promise<void>;
}
