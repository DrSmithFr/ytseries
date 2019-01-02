<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190102093744 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SEQUENCE series_type_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE series_type (id INT NOT NULL, name VARCHAR(255) NOT NULL, created_by VARCHAR(255) DEFAULT NULL, updated_by VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('ALTER TABLE series ADD series_type_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE series ADD CONSTRAINT FK_3A10012D9D47B361 FOREIGN KEY (series_type_id) REFERENCES series_type (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_3A10012D9D47B361 ON series (series_type_id)');
        $this->addSql('ALTER TABLE historic ALTER time_code SET DEFAULT 0');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('ALTER TABLE series DROP CONSTRAINT FK_3A10012D9D47B361');
        $this->addSql('DROP SEQUENCE series_type_id_seq CASCADE');
        $this->addSql('DROP TABLE series_type');
        $this->addSql('DROP INDEX IDX_3A10012D9D47B361');
        $this->addSql('ALTER TABLE series DROP series_type_id');
        $this->addSql('ALTER TABLE historic ALTER time_code DROP DEFAULT');
    }
}
