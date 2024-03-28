#include <iostream>
using namespace std;

void getHeightWidth(string, int&, int&);
void printTriangle(int, int);
void printAsterisks(int, int, int);

int main()
{
	int choice = -1;
	int width = 0;
	int height = 0;
	while (choice != 3)
	{
		cout << endl << "Enter your choice:\n1 to Rectangle \n2 to Triangle \n3 to exit\n";
		cin >> choice;

		if (choice == 1)
		{
			getHeightWidth("Rectangle", width, height);
			if (width == height || width - height > 5 || height - width > 5)
				cout << "The area of the rectangle is: " << (width * height) << endl;
			else
				cout << "The perimeter of the rectangle is: " << 2 * (width + height) << endl;
		}
		if (choice == 2)
		{
			getHeightWidth("Triangle", width, height);
			int triangleChoice = 0;
			cout << "enter:\n1 to calculate the perimeter of the triangle\n2 to print the triangle\n";
			cin >> triangleChoice;
			while (triangleChoice != 1 && triangleChoice != 2)
			{
				cout << "not value choice. please enter again: ";
				cin >> triangleChoice;
			}
			if (triangleChoice == 1)
				cout << "The perimeter of the rectangle is: " << (2 * height + width) << endl;
			else if (triangleChoice == 2)
				printTriangle(height, width);
		}
	}
	return 0;
}
//Function to receive the height and width from the user
void getHeightWidth(string type, int& width, int& height)
{
	cout << "Enter " << type << " Height: ";
	cin >> height;
	while (height < 2)
	{
		cout << "The Height Have to Be At Least 2. enter The Height Again: ";
		cin >> height;
	}

	cout << "Enter " << type << " Width: ";
	cin >> width;
	while (width < 1)
	{
		cout << "The Width Have to Be Positive. enter The Width Again: ";
		cin >> width;
	}
}

//Function to print the triangle according to height and width
void printTriangle(int height, int width)
{
	if (width % 2 == 0 || width > 2 * height)
		cout << "The triangle cannot be printed";
	else
	{
		int numOfDifferentWidths = 1;
		//Calculating the number of different possible widths
		if (width > 5)
			numOfDifferentWidths = (width - 5) / 2 + 1;
		//Calculating the number of times each width will be printed
		int numOfTimesEveryWidthIsPrinted = (height - 2) / numOfDifferentWidths;

		//printing the first line with one *
		printAsterisks(width / 2, 1, 1);

		//printing the line with the 3 * according to the remainder of the division
		printAsterisks((width - 3) / 2, 3, (height - 2) % numOfDifferentWidths);

		//Going over the number of possible widths
		for (int i = 0; i < numOfDifferentWidths; i++)
		{
			printAsterisks((width - 3 - i * 2) / 2, (3 + i * 2), numOfTimesEveryWidthIsPrinted);
		}
		//printing the last line - filled with * as the width of the triangle
		printAsterisks(0, width, 1);

	}
}

//Function to print rows of asterisks according to quantity and format received
void printAsterisks(int spaces, int asterisks, int lines)
{
	//print this line as many times as needed
	for (int i = 0; i < lines; i++)
	{
		//printing the number of spaces at the beginning of the line
		for (int j = 0; j < spaces; j++)
			cout << " ";
		//printing the number of stars
		for (int j = 0; j < asterisks; j++)
			cout << "*";
		cout << endl;
	}
}