'use strict'

document.addEventListener("DOMContentLoaded", function () {
    fetch("/account/getAccounts")
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error("Network response was not OK")
      })
      .then((data) => {
        console.log(data)
        buildAccountTable(data)
      })
      .catch((error) => {
        console.log("There was a problem: ", error.message)
      })
  })

  function buildAccountTable(accounts) {
    const tableDiv = document.querySelector("#accountTable")
  
    let tableHTML = `
        <table id="accountDisplay">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Account Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `
  
    accounts.forEach(account => {

    if (!account.account_id) return; // skip if ID is invalid

      tableHTML += `
        <tr>
          <td>${account.account_firstname}</td>
          <td>${account.account_lastname}</td>
          <td>${account.account_email}</td>
          <td>${account.account_type}</td>
          <td>
            <a href="/account/admin-update/${account.account_id}" title="select to edit account">Edit</a>
            <a href="/account/delete/${account.account_id}" title="select to delete account">Delete</a>
          </td>
        </tr>
      `
    })
  
    tableHTML += `
        </tbody>
      </table>
    `
  
    tableDiv.innerHTML = tableHTML
  }  