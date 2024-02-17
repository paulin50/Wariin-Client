import React, { useState } from "react";

import green from "../assets/images/green.png"
import pink from "../assets/images/pink.png"

const Pricing = () => {

    const [isYearly, setIsYearly] = useState(false);

    const packages = [
        {name: "Basique", monthlyPrice: 19, yearlyPrice: 199, description: "Acomon form of lorem ipsum reads: Lorem ipsum dolor sit amet, consectetur adiscipicing elit", green: green},
        {name: "Avancée", monthlyPrice: 39, yearlyPrice: 399, description: "Acomon form of lorem ipsum reads: Lorem ipsum dolor sit amet, consectetur adiscipicing elit", green: green},
        {name: "Professionelle", monthlyPrice: 59, yearlyPrice: 599, description: "Acomon form of lorem ipsum reads: Lorem ipsum dolor sit amet, consectetur adiscipicing elit", green: green},
    ]

    return (
        <div className="md:px-14 p-4 max-w-s mx-auto py-10">
            <div className="text-center">
                <h2 className="md:text-5xl text-3xl font-extrabold text-primary mb-2">Here are all our plans</h2>
                <p className="text-tartiary md:w-1/3 mx-auto px-4 ">A simple paragraph is compling of three major componants. The wich is 
                    often a declarative sentence.
                </p>

                {/* toggle pricing */}
                <div className="mt-16">
                    <label htmlFor="toggle" className="inline-flex items-center cursor-pointer">
                        <span className="mr-8 text-2xl font-semibold">Mensuel</span>
                        <div className="w-14 h-6 bg-gray-300 rounded-full transition duration-200 ease-in-out">
                            <div className={`w-6 h-6 rounded-full transition duration-200 ease-in-out ${isYearly ? "bg-sky-900 ml-8" : "bg-gray-500" }`}>
                            </div>
                        </div>
                        <span className="ml-8 text-2xl font-semibold">Annuel</span>
                    </label>
                    <input type="checkbox" id="toggle" className="hidden"  checked={isYearly} onChange={()=>setIsYearly(!isYearly)}/>
                </div>
            </div>

            {/* Pricing cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-20 md:w-11/12 mx-auto">
                {
                    packages.map((pkg, index) => <div key={index} className="border py-10 md:px-6 px-4 rounded-lg shadow-2xl">
                        <h3 className="text-3xl font-bold text-center text-primary ">{pkg.name}</h3>
                        <p className="text-tartiary text-center my-5">{pkg.description}</p>
                        <p className="mt-5 text-center text-violet-700 text-4xl font-bold">
                            {isYearly ? `${pkg.yearlyPrice}` : `${pkg.monthlyPrice}`} <span className="text-base text-black font-medium">/{isYearly ? 'Year' : 'Month' }</span>
                        </p>
                        {/* <ul className="mt-4 space-y-2 px-4">
                            <li className="flex gap-3 items-center"> <img src={green} alt=""  className="w-4 h-4"/> Acceuil</li>
                            <li className="flex gap-3 items-center"> <img src={green} alt=""  className="w-4 h-4"/> Ventes</li>
                            <li className="flex gap-3 items-center"> <img src={green} alt=""  className="w-4 h-4"/> Biens</li>
                            <li className="flex gap-3 items-center"> <img src={green} alt=""  className="w-4 h-4"/> Dépenses</li>
                            <li className="flex gap-3 items-center"> <img src={green} alt=""  className="w-4 h-4"/> Application web</li>
                            <li className="flex gap-3 items-center"> <img src={pink} alt=""  className="w-4 h-4"/> Communication</li>
                            <li className="flex gap-3 items-center"> <img src={pink} alt=""  className="w-4 h-4"/> Plusieurs Utilisateurs</li>
                        </ul> */}
                        <div className="w-full mx-auto mt-8 flex items-center justify-center">
                            <button className="hover:bg-violet-500 bg-violet-700 text-white rounded-md px-3" >Commencer</button>
                        </div>
                    </div>)
                }
            </div>
        </div>
    )
}

export default Pricing;