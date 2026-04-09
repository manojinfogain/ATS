using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;
using MySqlConnector;
using System.Data.SqlClient;

namespace ATSAPI.App_Data
{
    public class Connection
    {
        public SqlConnection ConCampus;
        public Connection()
        {
            ConnectionString = ConfigurationManager.ConnectionStrings["ATSConnection"].ToString();
        }
        string _Domain;
        public string Domain
        {
            get
            {
                return _Domain;
            }
            set
            {
                _Domain = value;
            }
        }
        string _FROMPWD;
        public string FROMPWD
        {
            get
            {
                return _FROMPWD;
            }
            set
            {
                _FROMPWD = value;
            }
        }
        string _FROMEMAIL;
        public string FROMEMAIL
        {
            get
            {
                return _FROMEMAIL;
            }
            set
            {
                _FROMEMAIL = value;
            }
        }
        string _SMTP;
        public string SMTP
        {
            get
            {
                return _SMTP;
            }
            set
            {
                _SMTP = value;
            }
        }
        string _ConnectionString;
        public string ConnectionString
        {
            get
            {
                return _ConnectionString;
            }
            set
            {
                _ConnectionString = value;
            }
        }

        protected string Scrub(string text) { return text.Replace("&nbsp;", ""); }

        public string ConCampus_ConnectionString
        {
            get
            {
                return ConnectionString;
            }
        }
        public string ConCampus_ConnectionString1
        {
            get
            {
                return System.Configuration.ConfigurationManager.AppSettings["ATSConnection"];
            }
        }

        /// <summary>
        /// This function is used to open connection for eEducation
        /// 
        /// </summary>
        public void OpeneConnection()
        {

            if (ConCampus == null)
            {
                ConCampus = new SqlConnection(ConCampus_ConnectionString);
            }
            if (ConCampus.State != System.Data.ConnectionState.Open)
            {
                @ConCampus.Open();
            }

        }

        public void CloseConnection()
        {

            if (ConCampus.State == System.Data.ConnectionState.Open)
            {
                ConCampus.Close();
            }

        }

        public void DisposeConnection()
        {

            if (ConCampus == null)
            {
                ConCampus.Dispose();
            }

        }
    }
}
